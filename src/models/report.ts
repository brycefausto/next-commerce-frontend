export interface CountReportSuperAdmin {
  userCount: number
  companyCount: number
}

export interface CountReportAdmin {
  userCount: number
  productCount: number
  inventoryCount: number
  orderCount: number
  lowStockCount: number
  pendingOrdersCount: number
}

export interface CountReportDistributor {
  inventoryCount: number
  orderCount: number
}
