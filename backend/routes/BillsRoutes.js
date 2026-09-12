const express = require('express')
const Bill = require('../models/Bills');
const router = express.Router();

// create a bill

router.post('/',async (req,res)=>{
    try {
        const bill = new Bill(req.body);
        await bill.save();
        res.status(201).json(bill);
    } catch (error) {
        res.status(500).json({message:'Failed to create bill',error});
    }
})

// get all bills

router.get('/', async(req,res)=>{
    try {
        const bills = await Bill.find();
        res.status(200).json(bills);
    } catch (error) {
        res.status(500).json({message:'Failed to get bills',error});
    }
});

// get bill by id

router.get('/:id',async (req,res)=>{
    try {
        const bill = await Bill.findById(req.params.id);
        res.status(200).json(bill);
    } catch (error) {
        res.status(500).json({message:'Failed to get bill',error});
    }
});

// update bill

router.put('/:id',async (req,res)=>{
    try {
        const bill = await Bill.findByIdAndUpdate(req.params.id,req.body,{new:true});
        res.status(200).json(bill);
    } catch (error) {
        res.status(500).json({message:'Failed to update bill',error});
    }
});

// delete bill

router.delete('/:id',async (req,res)=>{
    try {
        const bill = await Bill.findByIdAndDelete(req.params.id);
        res.status(200).json({message:'Bill deleted successfully',bill});
    } catch (error) {
        res.status(500).json({message:'Failed to delete bill',error});
    }
});



module.exports = router;
