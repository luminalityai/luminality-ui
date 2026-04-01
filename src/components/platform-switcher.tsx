import * as React from "react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu"
import { Avatar, AvatarFallback } from "./avatar"

export interface LinkedApp {
  name: string
  icon: React.ReactNode
  href: string
}

export interface Organisation {
  id: string
  name: string
}

export interface PlatformSwitcherProps {
  /**
   * App brand icon (ReactNode, e.g. an SVG or lucide icon).
   * The icon is rendered inside a square button whose background uses the
   * `--color-primary` CSS custom property. Consuming apps **must** define
   * this variable (e.g. in their Tailwind theme or a global stylesheet)
   * or pass a `className` override to control the button background.
   */
  icon: React.ReactNode
  /** App name — used for tooltip / sr-only label */
  label: string
  /** Cross-app navigation links */
  linkedApps?: LinkedApp[]
  /** Organisations the user can switch between */
  organisations?: Organisation[]
  /** Currently active organisation ID — shows check mark */
  activeOrganisationId?: string
  /** Callback when an organisation is selected */
  onSwitchOrganisation?: (id: string) => void
  /** When false, renders a static icon with no dropdown (default: true) */
  interactive?: boolean
  /** Optional className to override the trigger button styles (e.g. background color) */
  className?: string
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
  )
}

function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M3 2C2.44772 2 2 2.44772 2 3V12C2 12.5523 2.44772 13 3 13H12C12.5523 13 13 12.5523 13 12V8.5C13 8.22386 12.7761 8 12.5 8C12.2239 8 12 8.22386 12 8.5V12H3V3H6.5C6.77614 3 7 2.77614 7 2.5C7 2.22386 6.77614 2 6.5 2H3ZM12.8536 2.14645C12.9015 2.19439 12.9377 2.24964 12.9621 2.30861C12.9861 2.36669 12.9996 2.4303 13 2.497L13 2.5V2.50049V5.5C13 5.77614 12.7761 6 12.5 6C12.2239 6 12 5.77614 12 5.5V3.70711L6.85355 8.85355C6.65829 9.04882 6.34171 9.04882 6.14645 8.85355C5.95118 8.65829 5.95118 8.34171 6.14645 8.14645L11.2929 3H9.5C9.22386 3 9 2.77614 9 2.5C9 2.22386 9.22386 2 9.5 2H12.4999H12.5C12.5678 2 12.6324 2.01349 12.6914 2.03794C12.7504 2.06234 12.8056 2.09851 12.8536 2.14645Z"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
  )
}

const PlatformSwitcher = React.forwardRef<
  HTMLButtonElement,
  PlatformSwitcherProps
>(
  (
    {
      icon,
      label,
      linkedApps,
      organisations,
      activeOrganisationId,
      onSwitchOrganisation,
      interactive = true,
      className: classNameProp,
    },
    ref,
  ) => {
    const hasLinkedApps = linkedApps && linkedApps.length > 0
    const hasOrganisations = organisations && organisations.length > 0

    const triggerButton = (
      <button
        ref={interactive ? undefined : ref}
        className={cn(
          "relative flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-primary)] text-white",
          interactive && "cursor-pointer",
          classNameProp,
        )}
        aria-label={label}
        type="button"
      >
        {icon}
        {interactive && (
          <span className="absolute bottom-0 right-0 flex h-3 w-3 items-center justify-center rounded-sm bg-black/40">
            <ChevronDownIcon className="h-2.5 w-2.5" />
          </span>
        )}
      </button>
    )

    if (!interactive || (!hasLinkedApps && !hasOrganisations)) {
      return triggerButton
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger ref={ref} asChild>
          {triggerButton}
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start" className="w-52">
          {hasLinkedApps && (
            <>
              <DropdownMenuLabel>Apps</DropdownMenuLabel>
              {linkedApps.map((app) => (
                <DropdownMenuItem key={app.href} asChild>
                  <a
                    href={app.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center">
                      {app.icon}
                    </span>
                    <span className="flex-1">{app.name}</span>
                    <ExternalLinkIcon className="ml-auto h-3.5 w-3.5 opacity-50" />
                  </a>
                </DropdownMenuItem>
              ))}
            </>
          )}

          {hasLinkedApps && hasOrganisations && <DropdownMenuSeparator />}

          {hasOrganisations && (
            <>
              <DropdownMenuLabel>Organisations</DropdownMenuLabel>
              {organisations.map((org) => (
                <DropdownMenuItem
                  key={org.id}
                  className="flex items-center gap-2"
                  onSelect={() => onSwitchOrganisation?.(org.id)}
                >
                  <Avatar className="h-6 w-6 rounded-md">
                    <AvatarFallback className="rounded-md text-xs">
                      {org.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="flex-1">{org.name}</span>
                  {activeOrganisationId === org.id && (
                    <CheckIcon className="ml-auto h-4 w-4" />
                  )}
                </DropdownMenuItem>
              ))}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  },
)
PlatformSwitcher.displayName = "PlatformSwitcher"

export { PlatformSwitcher }
