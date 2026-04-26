import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import { Time, TimezoneProvider } from "@/components/time"

describe("Time", () => {
  const isoDate = "2024-01-01T12:00:00Z"

  it("renders em dash when date is null", () => {
    const { container } = render(<Time date={null} className="muted" />)
    const span = container.querySelector("span")
    expect(span).not.toBeNull()
    expect(span?.textContent).toBe("—")
    expect(span?.className).toBe("muted")
    expect(container.querySelector("time")).toBeNull()
  })

  it("uses default date format", () => {
    const { container } = render(<Time date={isoDate} timezone="UTC" />)
    const time = container.querySelector("time")
    expect(time).not.toBeNull()
    expect(time?.textContent).toBe("2024.01.01")
  })

  it("reads timezone from TimezoneProvider", () => {
    const { container } = render(
      <TimezoneProvider value="America/New_York">
        <Time date={isoDate} format="datetime" />
      </TimezoneProvider>,
    )
    const time = container.querySelector("time")
    expect(time?.textContent).toBe("2024.01.01 07:00")
    expect(time?.getAttribute("title")).toBe("America/New_York")
  })

  it("explicit timezone prop overrides provider", () => {
    const { container } = render(
      <TimezoneProvider value="America/New_York">
        <Time date={isoDate} format="datetime" timezone="UTC" />
      </TimezoneProvider>,
    )
    const time = container.querySelector("time")
    expect(time?.textContent).toBe("2024.01.01 12:00")
    expect(time?.getAttribute("title")).toBe("UTC")
  })

  it("supports relative format", () => {
    const recent = new Date(Date.now() - 60000).toISOString()
    const { container } = render(<Time date={recent} format="relative" />)
    const time = container.querySelector("time")
    expect(time?.textContent).toContain("ago")
  })

  it("supports datetime-tz format", () => {
    const { container } = render(
      <Time date={isoDate} format="datetime-tz" timezone="UTC" />,
    )
    const time = container.querySelector("time")
    expect(time?.textContent).toBe("2024.01.01 12:00 UTC")
  })

  it("sets dateTime and title attributes", () => {
    const { container } = render(<Time date={isoDate} timezone="UTC" />)
    const time = container.querySelector("time")
    expect(time?.getAttribute("datetime")).toBe(isoDate)
    expect(time?.getAttribute("title")).toBe("UTC")
  })

  it("renders em dash for unparseable date strings", () => {
    const { container } = render(<Time date="not-a-date" className="muted" />)
    expect(container.querySelector("time")).toBeNull()
    const span = container.querySelector("span")
    expect(span?.textContent).toBe("—")
    expect(span?.className).toBe("muted")
  })

  it("inner TimezoneProvider with undefined value does not shadow outer provider", () => {
    const { container } = render(
      <TimezoneProvider value="America/New_York">
        <TimezoneProvider value={undefined}>
          <Time date={isoDate} format="datetime" />
        </TimezoneProvider>
      </TimezoneProvider>,
    )
    const time = container.querySelector("time")
    expect(time?.textContent).toBe("2024.01.01 07:00")
    expect(time?.getAttribute("title")).toBe("America/New_York")
  })
})
