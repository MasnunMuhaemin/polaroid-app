<?php

namespace App\Filament\Resources\Orders\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class OrderForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('order_code')
                    ->required(),
                TextInput::make('name')
                    ->required(),
                TextInput::make('phone')
                    ->tel()
                    ->required(),
                Textarea::make('address')
                    ->required()
                    ->columnSpanFull(),
                TextInput::make('paper_size')
                    ->required(),
                TextInput::make('mode')
                    ->required(),
                Textarea::make('layout_json')
                    ->required()
                    ->columnSpanFull(),
                TextInput::make('pdf_path'),
                TextInput::make('status')
                    ->required()
                    ->default('pending'),
            ]);
    }
}
