import { ScopeItem } from "@/types";

export function parseBriefIntoScopeItems(rawBrief: string): ScopeItem[] {
  const text = (rawBrief || "").trim();
  if (!text) return [];

  // Match list lines: bullets (-, *, •), or numbers (1., 2), etc.)
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

  const parsedItems: ScopeItem[] = [];
  const listRegex = /^([*\-•]|\d+[.)])\s+(.+)$/;

  let currentItem: Partial<ScopeItem> | null = null;
  let counter = 1;

  for (const line of lines) {
    const listMatch = line.match(listRegex);
    if (listMatch) {
      if (currentItem && currentItem.title) {
        parsedItems.push({
          id: `item-${counter++}`,
          title: currentItem.title,
          description: currentItem.description || "",
          userConfirmed: true,
        });
      }

      const content = listMatch[2].trim();
      // Check if line has title: description format
      const colonIndex = content.indexOf(":");
      if (colonIndex > 2 && colonIndex < 40) {
        currentItem = {
          title: content.slice(0, colonIndex).trim(),
          description: content.slice(colonIndex + 1).trim(),
        };
      } else {
        currentItem = {
          title: content,
          description: "",
        };
      }
    } else if (currentItem) {
      // Append continuation lines to current item's description
      currentItem.description = currentItem.description
        ? `${currentItem.description} ${line}`
        : line;
    }
  }

  if (currentItem && currentItem.title) {
    parsedItems.push({
      id: `item-${counter++}`,
      title: currentItem.title,
      description: currentItem.description || "",
      userConfirmed: true,
    });
  }

  // Safe Fallback: Unstructured text with no list items
  if (parsedItems.length === 0) {
    parsedItems.push({
      id: "item-1",
      title: text.length > 50 ? `${text.slice(0, 47)}...` : text,
      description: text,
      userConfirmed: true,
    });
  }

  return parsedItems;
}
