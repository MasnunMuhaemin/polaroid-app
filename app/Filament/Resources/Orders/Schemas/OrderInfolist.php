<?php

namespace App\Filament\Resources\Orders\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class OrderInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('order_code'),
                TextEntry::make('name'),
                TextEntry::make('phone'),
                TextEntry::make('address')
                    ->columnSpanFull(),
                TextEntry::make('paper_size'),
                TextEntry::make('mode'),
                TextEntry::make('layout_json')
                    ->columnSpanFull(),
                TextEntry::make('pdf_path')
                    ->placeholder('-'),
                TextEntry::make('status'),
                TextEntry::make('created_at')
                    ->dateTime()
                    ->placeholder('-'),
                TextEntry::make('updated_at')
                    ->dateTime()
                    ->placeholder('-'),
            ]);
    }
}
