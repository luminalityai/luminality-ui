import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
  Button,
} from "@rarebit-one/luminality-ui"
import { Section } from "../../components/section"

export function DialogPage() {
  return (
    <>
      <h1 className="text-2xl font-bold text-[var(--color-text)]">Dialog</h1>
      <p className="text-[var(--color-text-muted)]">Modal dialog overlaid on the page.</p>

      <Section title="Interactive Preview">
        <div className="flex items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border)] p-8 min-h-[120px]">
          <Dialog>
            <DialogTrigger asChild>
              <Button>Open Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>Make changes to your profile here.</DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Dialog body content goes here. This could contain forms, information, or any content.
                </p>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="ghost">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button>Save Changes</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </Section>

      <Section title="Variants">
        <div className="flex flex-wrap gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Simple Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Simple Dialog</DialogTitle>
              </DialogHeader>
              <p className="text-sm text-[var(--color-text-secondary)]">A dialog with just a title and content.</p>
              <DialogFooter>
                <DialogClose asChild>
                  <Button>OK</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">With Description</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Action</DialogTitle>
                <DialogDescription>This will perform an important action that you should be aware of.</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="ghost">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button>Proceed</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </Section>

      <Section title="Usage">
        <pre className="p-4 rounded-[var(--radius-md)] bg-[var(--color-muted)] text-sm overflow-x-auto">
{`import {
  Dialog, DialogTrigger, DialogContent,
  DialogHeader, DialogTitle, DialogDescription,
  DialogFooter, DialogClose,
} from "@rarebit-one/luminality-ui"

<Dialog>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <DialogClose asChild>
        <Button>Close</Button>
      </DialogClose>
    </DialogFooter>
  </DialogContent>
</Dialog>`}
        </pre>
      </Section>
    </>
  )
}
