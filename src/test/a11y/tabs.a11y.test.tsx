import { render } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { axe } from "vitest-axe"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/tabs"

describe("Tabs (a11y)", () => {
  it("has no axe violations with default tab selected", async () => {
    const { container } = render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>,
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
