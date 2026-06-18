"use client"

import { createFormHook } from "@tanstack/react-form"

import {
  baseFieldComponents,
  baseFormComponents,
  fieldContext,
  formContext,
} from "@/lib/form"

import {
  CitySelectField,
  DestinationSelectField,
  InclusionItemSelectField,
} from "./select-fields"

const { useAppForm } = createFormHook({
  fieldComponents: {
    ...baseFieldComponents,
    CitySelectField,
    DestinationSelectField,
    InclusionItemSelectField,
  },
  formComponents: baseFormComponents,
  fieldContext,
  formContext,
})

export { useAppForm }
