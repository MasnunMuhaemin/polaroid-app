<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'order_code',
        'name',
        'phone',
        'address',
        'paper_size',
        'mode',
        'layout_json',
        'pdf_path',
        'status',
    ];

    public function photos()
    {
        return $this->hasMany(OrderPhoto::class);
    }
}
