const express = require('express');
const Order = require('../models/Order');
const router = express.Router();

router.post('/order', async (req, res) => {
    try {
        const { email, order_data, order_date } = req.body;

        let existingOrder = await Order.findOne({ email });

        if (!existingOrder) {
            // Create a new order if it doesn't exist
            await Order.create({
                email,
                order_data: [{ Order_date: order_date, order_data }]
            });
        } else {
            // Update existing order with new data
            existingOrder.order_data.push({ Order_date: order_date, order_data });
            await existingOrder.save();
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Error in processing order:", error);
        res.status(500).json({ success: false, error: "Server Error" });
    }
});




router.post('/myOrder', async (req, res) => {
    try {
        const userEmail = req.body.email;
        const order = await Order.findOne({ email: userEmail });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        console.error('Error fetching order data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;







