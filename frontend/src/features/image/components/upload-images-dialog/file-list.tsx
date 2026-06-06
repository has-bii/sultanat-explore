import { InfoIcon } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ItemGroup } from "@/components/ui/item"

import { FileListItem } from "./file-list-item"

type Props = {
  files: Map<string, File>
  onRemove: (fileName: string) => void
}

export default function FileList({ files, onRemove }: Props) {
  return (
    <>
      {/* Alert */}
      {files.size > 10 && (
        <Alert variant="destructive">
          <InfoIcon />
          <AlertTitle>Maksimal 10 Foto</AlertTitle>
          <AlertDescription>Kurangi {files.size - 10} foto untuk melanjutkan</AlertDescription>
        </Alert>
      )}

      {/* Selected files */}
      {files.size > 0 && (
        <div className="bg-accent flex items-center justify-center rounded-sm px-3 py-2.5">
          <p className="text-primary text-sm">{files.size} foto yang akan di-upload</p>
        </div>
      )}

      {/* Files list */}
      {files.size > 0 && (
        <ItemGroup className="no-scrollbar max-h-96 overflow-y-auto">
          {Array.from(files.values()).map((file) => (
            <FileListItem key={file.name} file={file} handleRemove={() => onRemove(file.name)} />
          ))}
        </ItemGroup>
      )}
    </>
  )
}
