// Utilities
import { parseToOpenNebulaFormat } from "@/utils/parser"

// Handle the copy template action
const handleCopyTemplate = async (appliance, showMessage) => {
  // Get template in OpenNebula format
  const openNebulaTemplate = appliance?.opennebula_template
    ? parseToOpenNebulaFormat(JSON.parse(appliance?.opennebula_template))
    : undefined

  const text = openNebulaTemplate

  if (navigator?.clipboard) {
    // Modern API (works in secure contexts)
    try {
      await navigator.clipboard.writeText(text)
      showMessage("Template copied to clipboard!")
    } catch {
      fallbackCopyText(text, showMessage)
    }
  } else {
    // Fallback for HTTP / older browsers
    fallbackCopyText(text, showMessage)
  }
}

// Fallback copy function using execCommand
const fallbackCopyText = (text, showMessage) => {
  const textarea = document.createElement("textarea")
  textarea.value = text
  textarea.setAttribute("readonly", "")
  textarea.style.position = "absolute"
  textarea.style.left = "-9999px"
  document.body.appendChild(textarea)
  textarea.select()

  try {
    const successful = document.execCommand("copy")
    if (successful) {
      showMessage("Template copied to clipboard!")
    } else {
      showMessage("Failed to copy template.")
    }
  } catch {
    showMessage("Failed to copy template.")
  }

  document.body.removeChild(textarea)
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
