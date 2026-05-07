## Frontend Implementation Guide for Order Tracking

### API Endpoint
`GET /api/v1/doctor/order/orders/:id` (or `/orders/:id/tracking`)

### Response Structure to Consume

```javascript
{
  hw_order_id: 61055,           // HealthWarehouse order ID
  order_status: "processing",   // HW status: processing/dispensed/complete/canceled
  status: "processing",         // Local mapped status
  order_status_description: "Your order is being reviewed by the pharmacy...",
  is_processing: true,
  is_shipped: false,
  is_cancelled: false,
  has_tracking: false,
  tracking_number: null,
  shipments: [],
  estimated_message: "Estimated processing time: 1-2 business days",
  paymentStatus: "paid"
}
```

### Status Display Mapping

| HW Status | Local Status | UI Badge | Description |
|-----------|--------------|----------|-------------|
| `processing` | `confirmed` | "Processing" (blue) | Order received by pharmacy |
| `transfer_success` | `confirmed` | "Processing" (blue) | Prescription transferred |
| `transfer_failure` | `processing` | "Error" (red) | Transfer failed |
| `dispensed` | `dispensed` | "Dispensed" (orange) | Medication prepared |
| `complete` | `shipped` | "Shipped" (purple) | Tracking available |
| `canceled` | `cancelled` | "Cancelled" (gray) | Order cancelled |

### Components to Implement

1. **Order Status Banner**
   - Show status badge + description
   - Display ETA when available
   - Hide tracking section if `has_tracking: false`

2. **Status Timeline**
   - Steps: Order Received → Pharmacy Review → Dispensed → Shipped → Delivered
   - Highlight current step based on `is_processing`/`is_shipped`/`is_cancelled`

3. **Tracking Section** (conditional)
   - Only show when `has_tracking: true`
   - Display tracking number as clickable carrier link

4. **Admin/Test Environment**
   - Add "Simulate Status" button for test mode
   - Call `POST /admin/hw/orders/:hwOrderId/simulate-status` with body `{ status: "dispensed" }`