import { useState } from "react"
import { Section } from "../components/section"
import { Button } from "@lib/components/button"
import { Checkbox } from "@lib/components/checkbox"
import { Badge } from "@lib/components/badge"
import { Status } from "@lib/components/status"
import { Callout } from "@lib/components/callout"
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter,
} from "@lib/components/card"
import { Avatar, AvatarFallback } from "@lib/components/avatar"
import { Blockquote } from "@lib/components/blockquote"
import { Separator } from "@lib/components/separator"
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@lib/components/dialog"
import {
  AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel,
} from "@lib/components/alert-dialog"
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel,
} from "@lib/components/dropdown-menu"
import {
  Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage as BreadcrumbPageItem,
} from "@lib/components/breadcrumb"
import { PageHeader } from "@lib/components/page-header"
import {
  Accordion, AccordionItem, AccordionTrigger, AccordionContent,
} from "@lib/components/accordion"
import {
  List, ListSection, ListItem, ListItemTitle, ListItemDescription,
} from "@lib/components/list"

export function KitchenSink() {
  const [checked, setChecked] = useState(false)

  return (
    <>
      <h1 className="text-2xl font-bold text-[var(--color-text)]">Kitchen Sink</h1>
      <p className="text-[var(--color-text-muted)]">All components at a glance.</p>

      {/* Actions */}
      <Section title="Actions">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {(["primary", "secondary", "accent", "info", "success", "danger", "warning", "ghost", "muted", "outline"] as const).map(
              (v) => <Button key={v} variant={v}>{v}</Button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
            <Button disabled>Disabled</Button>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox checked={checked} onCheckedChange={(c) => setChecked(c === true)} id="ks-cb" />
            <label htmlFor="ks-cb" className="text-sm text-[var(--color-text)]">Check me</label>
          </div>
        </div>
      </Section>

      {/* Feedback */}
      <Section title="Feedback">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {(["primary", "secondary", "accent", "info", "success", "warning", "danger", "muted"] as const).map(
              (v) => <Badge key={v} variant={v}>{v}</Badge>
            )}
          </div>
          <div className="flex flex-wrap gap-4">
            {(["active", "online", "offline", "completed", "failed", "cancelled", "processing"] as const).map(
              (v) => <Status key={v} variant={v}>{v}</Status>
            )}
          </div>
          <div className="space-y-3">
            {(["info", "warning", "success", "danger", "note"] as const).map((v) => (
              <Callout key={v} variant={v} title={v.charAt(0).toUpperCase() + v.slice(1)}>
                This is a {v} callout message.
              </Callout>
            ))}
          </div>
        </div>
      </Section>

      {/* Data Display */}
      <Section title="Data Display">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>A brief description of this card.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[var(--color-text-secondary)]">Card body content goes here.</p>
            </CardContent>
            <CardFooter>
              <Button size="sm">Action</Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader padding="lg">
              <CardTitle>Large Padding</CardTitle>
              <CardDescription>This card uses large padding.</CardDescription>
            </CardHeader>
            <CardContent padding="lg">
              <p className="text-sm text-[var(--color-text-secondary)]">More spacious layout.</p>
            </CardContent>
          </Card>
        </div>
        <div className="flex items-center gap-3">
          <Avatar><AvatarFallback>JD</AvatarFallback></Avatar>
          <Avatar className="h-8 w-8"><AvatarFallback className="text-xs">AB</AvatarFallback></Avatar>
          <Avatar className="h-14 w-14"><AvatarFallback className="text-lg">XY</AvatarFallback></Avatar>
        </div>
        <Blockquote author="Marcus Aurelius" source="Meditations">
          The happiness of your life depends upon the quality of your thoughts.
        </Blockquote>
        <div className="space-y-2">
          <Separator />
          <Separator dashed />
          <div className="flex h-8 items-center gap-4">
            <span className="text-sm">Left</span>
            <Separator orientation="vertical" />
            <span className="text-sm">Right</span>
          </div>
        </div>
      </Section>

      {/* Overlays */}
      <Section title="Overlays">
        <div className="flex flex-wrap gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Open Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Dialog Title</DialogTitle>
                <DialogDescription>This is a dialog description.</DialogDescription>
              </DialogHeader>
              <p className="text-sm text-[var(--color-text-secondary)]">Dialog body content.</p>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="ghost">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button>Confirm</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="danger">Delete Item</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="muted">Open Menu</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-[var(--color-danger)]">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Section>

      {/* Navigation */}
      <Section title="Navigation">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Components</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPageItem>Breadcrumb</BreadcrumbPageItem>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <PageHeader
          breadcrumbs={[
            { label: "Home", href: "#" },
            { label: "Settings", href: "#" },
            { label: "Profile" },
          ]}
          actions={<Button size="sm">Save</Button>}
        />
      </Section>

      {/* Layout */}
      <Section title="Layout">
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>What is luminality-ui?</AccordionTrigger>
            <AccordionContent>
              A design system built with React, Tailwind CSS, and Radix UI primitives.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>How do I install it?</AccordionTrigger>
            <AccordionContent>
              Install via npm from GitHub Packages: <code>npm install @rarebit-one/luminality-ui</code>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <List>
          <ListSection title="Team Members">
            <ListItem prefix="JD">
              <div className="flex-1 min-w-0">
                <ListItemTitle>Jane Doe</ListItemTitle>
                <ListItemDescription>Engineering Lead</ListItemDescription>
              </div>
            </ListItem>
            <ListItem prefix="AB">
              <div className="flex-1 min-w-0">
                <ListItemTitle>Alice Brown</ListItemTitle>
                <ListItemDescription>Designer</ListItemDescription>
              </div>
            </ListItem>
          </ListSection>
        </List>
      </Section>
    </>
  )
}
