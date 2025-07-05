import { AddressInfo } from "@/models/addressInfo"
import { SearchParams } from "@/types"

export function convertToUrlParams(params: SearchParams) {
  const urlParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      if (Array.isArray(value)) {
        value.forEach((value) => urlParams.append(key, value.toString()))
      } else {
        urlParams.append(key, value.toString())
      }
    }
  })

  return urlParams
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "PHP",
  }).format(price)
}

export function getInitials(name: string) {
  // Trim any leading or trailing whitespace from the name
  const trimmedName = name.trim()

  // If the name is empty after trimming, return an empty string
  if (trimmedName === "") {
    return ""
  }

  // Split the name into individual words based on spaces
  const words = trimmedName.split(" ")

  let initials = ""

  // Iterate over each word to extract the first letter
  for (let i = 0; i < words.length; i++) {
    const word = words[i]
    // Check if the word is not empty (to handle multiple spaces or leading/trailing spaces)
    if (word.length > 0) {
      // Take the first character of the word and convert it to uppercase
      initials += word.charAt(0).toUpperCase()
    }
  }

  return initials
}

export function addressInfoToString(addressInfo?: AddressInfo) {
  return addressInfo
    ? `${addressInfo.address} ${
        addressInfo.address2 ? addressInfo.address2 + " " : ""
      }${addressInfo.city} ${addressInfo.state} ${addressInfo.zipCode}`
    : ""
}

export function slugify(str: string) {
  // Convert to lowercase
  str = str.toLowerCase()

  // Remove accents/diacritics (optional, but highly recommended for internationalization)
  str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")

  // Replace non-alphanumeric characters (except hyphens and underscores) with hyphens
  str = str.replace(/[^a-z0-9\s-]/g, "")

  // Replace spaces and multiple hyphens with a single hyphen
  str = str.replace(/[\s-]+/g, "-")

  // Trim leading/trailing hyphens
  str = str.replace(/^-+|-+$/g, "")

  return str
}
