import { HTTPException } from "hono/http-exception"

import { hashPassword } from "better-auth/crypto"
import { db } from "backend/lib/db"
import type {
  CreateUserInput,
  UpdateUserRoleInput,
  UserQueryOutput,
} from "backend/modules/user/users.schema"
import type { UserModel } from "backend/generated/prisma/models/User"

function toUserDto(user: UserModel) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.image,
    role: user.role,
    createdAt: user.createdAt.toISOString(),
  }
}

export async function listUsers(query: UserQueryOutput) {
  const users = await db.user.findMany({
    orderBy: { [query.sort]: query.order },
  })
  return users.map(toUserDto)
}

export async function getUser(id: string) {
  const user = await db.user.findUnique({ where: { id } })
  if (!user) throw new HTTPException(404, { message: "Pengguna tidak ditemukan" })
  return toUserDto(user)
}

export async function createUser(input: CreateUserInput) {
  const existing = await db.user.findUnique({ where: { email: input.email } })
  if (existing) {
    throw new HTTPException(409, { message: "Email sudah terdaftar" })
  }

  const hashedPassword = await hashPassword(input.password)

  const user = await db.$transaction(async (tx) => {
    const created = await tx.user.create({
      data: {
        name: input.name,
        email: input.email,
        role: input.role,
        emailVerified: true,
      },
    })

    await tx.account.create({
      data: {
        userId: created.id,
        accountId: created.id,
        providerId: "credential",
        password: hashedPassword,
      },
    })

    return created
  })

  return toUserDto(user)
}

export async function updateUserRole(id: string, input: UpdateUserRoleInput) {
  const existing = await db.user.findUnique({ where: { id } })
  if (!existing) throw new HTTPException(404, { message: "Pengguna tidak ditemukan" })

  await db.user.update({
    where: { id },
    data: { role: input.role },
  })
}

export async function deleteUser(id: string, currentUserId: string) {
  if (id === currentUserId) {
    throw new HTTPException(403, { message: "Tidak dapat menghapus akun sendiri" })
  }

  const target = await db.user.findUnique({ where: { id } })
  if (!target) throw new HTTPException(404, { message: "Pengguna tidak ditemukan" })

  if (target.role === "admin") {
    const adminCount = await db.user.count({ where: { role: "admin" } })
    if (adminCount <= 1) {
      throw new HTTPException(403, { message: "Tidak dapat menghapus admin terakhir" })
    }
  }

  await db.user.delete({ where: { id } })
}
