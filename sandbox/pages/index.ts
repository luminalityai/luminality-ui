import type { ComponentType } from "react"
import { KitchenSink } from "./kitchen-sink"
import { ButtonPage } from "./components/button-page"
import { BadgePage } from "./components/badge-page"
import { CardPage } from "./components/card-page"
import { DialogPage } from "./components/dialog-page"
import { AlertDialogPage } from "./components/alert-dialog-page"
import { CalloutPage } from "./components/callout-page"
import { StatusPage } from "./components/status-page"
import { CheckboxPage } from "./components/checkbox-page"
import { AvatarPage } from "./components/avatar-page"
import { BlockquotePage } from "./components/blockquote-page"
import { SeparatorPage } from "./components/separator-page"
import { AccordionPage } from "./components/accordion-page"
import { ListPage } from "./components/list-page"
import { BreadcrumbPage } from "./components/breadcrumb-page"
import { PageHeaderPage } from "./components/page-header-page"
import { DropdownMenuPage } from "./components/dropdown-menu-page"

export interface PageEntry {
  label: string
  component: ComponentType
  category?: string
}

export const pages: Record<string, PageEntry> = {
  "kitchen-sink": { label: "Kitchen Sink", component: KitchenSink },
  button: { label: "Button", component: ButtonPage, category: "Actions" },
  checkbox: { label: "Checkbox", component: CheckboxPage, category: "Actions" },
  badge: { label: "Badge", component: BadgePage, category: "Feedback" },
  status: { label: "Status", component: StatusPage, category: "Feedback" },
  callout: { label: "Callout", component: CalloutPage, category: "Feedback" },
  card: { label: "Card", component: CardPage, category: "Data Display" },
  avatar: { label: "Avatar", component: AvatarPage, category: "Data Display" },
  blockquote: { label: "Blockquote", component: BlockquotePage, category: "Data Display" },
  separator: { label: "Separator", component: SeparatorPage, category: "Data Display" },
  dialog: { label: "Dialog", component: DialogPage, category: "Overlays" },
  "alert-dialog": { label: "AlertDialog", component: AlertDialogPage, category: "Overlays" },
  "dropdown-menu": { label: "DropdownMenu", component: DropdownMenuPage, category: "Overlays" },
  breadcrumb: { label: "Breadcrumb", component: BreadcrumbPage, category: "Navigation" },
  "page-header": { label: "PageHeader", component: PageHeaderPage, category: "Navigation" },
  accordion: { label: "Accordion", component: AccordionPage, category: "Layout" },
  list: { label: "List", component: ListPage, category: "Layout" },
}

const categoryOrder = ["Actions", "Feedback", "Data Display", "Overlays", "Navigation", "Layout"]

export function getGroupedPages() {
  const groups: Record<string, Array<{ key: string } & PageEntry>> = {}
  for (const [key, entry] of Object.entries(pages)) {
    if (!entry.category) continue
    const cat = entry.category
    if (!groups[cat]) groups[cat] = []
    groups[cat].push({ key, ...entry })
  }
  return categoryOrder
    .map((cat) => ({ category: cat, items: groups[cat] || [] }))
    .filter((g) => g.items.length > 0)
}
