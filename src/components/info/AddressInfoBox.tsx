import { AddressInfo } from "@/models/addressInfo"

export interface AddressInfoBoxProps {
  addressInfo: AddressInfo
  className?: string
}

export default function AddressInfoBox({
  addressInfo,
  className,
}: AddressInfoBoxProps) {
  return (
    <div className={className ? className : ""}>
      <h3 className="mb-2 text-lg font-semibold">Address Information</h3>
      <div>
        <span className="font-medium">Address:</span> {addressInfo.address}
      </div>
      {addressInfo.address2 && (
        <div>
          <span className="font-medium">Address 2:</span> {addressInfo.address2}
        </div>
      )}
      <div>
        <span className="font-medium">City:</span> {addressInfo.city}
      </div>
      <div>
        <span className="font-medium">State:</span> {addressInfo.state}
      </div>
      <div>
        <span className="font-medium">Zip:</span> {addressInfo.zipCode}
      </div>
    </div>
  )
}
