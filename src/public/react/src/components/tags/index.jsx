import { useEffect, useRef, useState } from "react"
import { Chip } from "@mui/material"

/**
 * Render the tags that fit the width of the container.
 * @param {Array} - List of tags.
 * @param {boolean} hideOverflow - Whether to hide overflowing tags (default: true).
 * @returns {JSX.Element} The rendered ApplianceCard component.
 */
const Tags = ({ tags, hideOverflow = true }) => {
  // Use ref to get the container
  const containerRef = useRef(null)

  // State for count the number of tags that fit the container
  const [visibleCount, setVisibleCount] = useState(tags.length)

  // Effect to create a resize observer that change the tags everytime the size changes
  useEffect(() => {
    // If all tags should be visible
    if (!hideOverflow) {
      setVisibleCount(tags.length)
      return
    }

    // Create the observer
    const observer = new ResizeObserver(() => {
      // Exit if not ref
      if (!containerRef.current) return

      // Get the container width
      const containerWidth = containerRef.current.offsetWidth

      // Initiliaze to zero the used width and the number of tags
      let usedWidth = 0
      let count = 0

      // Always measure ALL chips (they exist but are hidden off-screen)
      const chipElements =
        containerRef.current.querySelectorAll(".chip-measure")

      chipElements.forEach((chip) => {
        const chipWidth = chip.offsetWidth + 4
        if (usedWidth + chipWidth <= containerWidth) {
          usedWidth += chipWidth
          count++
        }
      })

      // +X chip
      if (count < tags.length) {
        const overflowChipWidth = 40
        while (count > 0 && usedWidth + overflowChipWidth > containerWidth) {
          usedWidth -= chipElements[count - 1].offsetWidth + 4
          count--
        }
      }

      // Show only visible tags
      setVisibleCount(count)
    })

    // If exists ref, add the observer
    if (containerRef.current) observer.observe(containerRef.current)

    return () => observer.disconnect()
  }, [tags, hideOverflow])

  const hiddenCount = tags.length - visibleCount

  return (
    <div
      ref={containerRef}
      style={{
        display: "flex",
        gap: "4px",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Render ALL tags but hide the extra ones */}
      {tags.map((tag, index) => (
        <Chip
          key={index}
          label={tag}
          size="small"
          className="chip-measure"
          variant="outlined"
          style={{
            display: index < visibleCount ? "inline-flex" : "none",
          }}
        />
      ))}
      {hiddenCount > 0 && (
        <Chip label={`+${hiddenCount}`} size="small" variant="outlined" />
      )}
    </div>
  )
}

export default Tags
