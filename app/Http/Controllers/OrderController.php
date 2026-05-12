<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderPhoto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        error_log("DEBUG: STORE METHOD CALLED");
        Log::info('Order Store Request Data:', $request->all());
        Log::info('Has PDF File: ' . ($request->hasFile('pdf_file') ? 'Yes' : 'No'));
        
        try {
            $validated = $request->validate([
                'order_code' => 'nullable|string|unique:orders,order_code',
                'name' => 'required|string',
                'phone' => 'required|string',
                'address' => 'required|string',
                'paper_size' => 'required|string',
                'mode' => 'required|string',
                'layout_json' => 'required|string',
                'pdf_file' => 'required|file|mimes:pdf|max:51200', // Max 50MB
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation Failed:', $e->errors());
            return redirect()->back()->withErrors($e->errors());
        }

        $orderCode = $request->order_code ?? ('POL-' . strtoupper(Str::random(6)));

        try {
            // Save PDF File
            $pdfPath = null;
            if ($request->hasFile('pdf_file') && $request->file('pdf_file')->isValid()) {
                $fileName = $orderCode . '_' . Str::slug($request->name) . '.pdf';
                $pdfPath = $request->file('pdf_file')->storeAs('orders_pdf', $fileName, 'public');
                Log::info('PDF Stored at: ' . $pdfPath);
            } else {
                Log::warning('PDF File missing or invalid in storage phase');
            }

            $order = Order::create([
                'order_code' => $orderCode,
                'name' => $request->name,
                'phone' => $request->phone,
                'address' => $request->address,
                'paper_size' => $request->paper_size,
                'mode' => $request->mode,
                'layout_json' => $request->layout_json,
                'pdf_path' => $pdfPath,
                'status' => 'pending',
            ]);

            return redirect()->back()->with('success', true)->with('order', [
                'order_code' => $orderCode,
                'name' => $order->name,
            ]);
        } catch (\Exception $e) {
            Log::error('Order Saving Failed:', ['msg' => $e->getMessage()]);
            return redirect()->back()->withErrors(['error' => 'Gagal menyimpan order: ' . $e->getMessage()]);
        }
    }
}
