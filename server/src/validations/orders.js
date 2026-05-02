const { z } = require('zod')

const createOrderSchema = z.object({
  body: z.object({
    items: z.array(z.object({
      id: z.number().optional(),
      product_id: z.number().optional(),
      qty: z.number().min(1, 'Kuantitas minimal 1'),
      price: z.number().min(0),
      sweetLevel: z.string().optional(),
      iceLevel: z.string().optional()
    })).min(1, 'Keranjang kosong'),
    delivery_mode: z.enum(['pickup', 'delivery']).optional(),
    voucher_id: z.number().optional(),
    notes: z.string().optional(),
    outlet_id: z.number().optional()
  })
})

module.exports = { createOrderSchema }
