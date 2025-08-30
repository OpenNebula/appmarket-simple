// Utilities
import { parseToOpenNebulaFormat } from "@/utils/parser"

// Handle the copy template action
const handleCopyTemplate = async (appliance, showMessage, dialogRef) => {
  // Check if the appliance has a template
  if (!appliance?.opennebula_template) {
    showMessage("There is no template for the selected appliance")
    return
  }

  // Get template in OpenNebula format
  const openNebulaTemplate = parseToOpenNebulaFormat(
    JSON.parse(appliance.opennebula_template),
  )
  const text = String(openNebulaTemplate ?? "")

  const isSecure = window.isSecureContext // true if HTTPS or localhost

  if (navigator?.clipboard && isSecure) {
    try {
      await navigator.clipboard.writeText(text)
      showMessage("Template copied to clipboard!")
      return
    } catch (err) {
      console.log("Clipboard API failed, falling back:", err)
      fallbackCopyText(text, showMessage)
    }
  }

  console.log("No clipboard available or insecure protocol, falling back:")
  fallbackCopyText(text, showMessage, dialogRef)

  // If not secure or Clipboard API failed → return false
  return false
}

// Copy when there is no clipboard
const fallbackCopyText = (text, showMessage, dialogRef) => {
  try {
    const textarea = document.createElement("textarea")
    textarea.value = String(text ?? "")
    textarea.style.opacity = "0"
    textarea.style.position = "fixed"
    textarea.style.top = "0"
    textarea.style.left = "0"

    dialogRef
      ? dialogRef.current.appendChild(textarea)
      : document.body.appendChild(textarea)

    textarea.focus()
    textarea.select()

    const successful = document.execCommand("copy")

    dialogRef
      ? dialogRef.current.removeChild(textarea)
      : document.body.removeChild(textarea)

    console.log("Fallback copy result:", successful)
    if (successful) {
      showMessage("Template copied to clipboard!")
    } else {
      showMessage("Failed to copy template")
    }
    return successful
  } catch (err) {
    console.error("Fallback copy error:", err)
    showMessage("Failed to copy template")
    return false
  }
}

// Handle the download action
const handleDownload = (appliance) => {
  // Get the download link for the appliance
  const downloadLink =
    typeof appliance?.links?.download.href === "string"
      ? appliance?.links?.download.href
      : undefined

  // Open new tab and download
  window.open(downloadLink, "_blank")
}

export { handleCopyTemplate, handleDownload }
