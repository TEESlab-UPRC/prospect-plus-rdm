<?php

namespace Database\Helpers;

use Illuminate\Database\Schema\Blueprint;

abstract class MigHelper{
    /**
     * Add foreign key column that references a table's "id" column. If not $nullable, deletes will cascade.
     */
    public static function ref(Blueprint $table, string $column, bool $index = false, bool $nullable = false, string $refTable = null): void{
        $cDef = $table->foreignId($column);
        !$index ?: $cDef->index();
        !$nullable ?: $cDef->nullable();
        $fRef = $cDef->constrained($refTable);
        $nullable ? $fRef->nullOnDelete() : $fRef->cascadeOnDelete();
    }

    /**
     * Shortcut for relationship tables. Note: this also adds an ID column.
     * The second foreign key column will always be indexed. Their combination will be forced to be unique.
     */
    public static function rel(Blueprint $table, string $column1, string $column2, bool $indexBoth = false, string $refTable1 = null, string $refTable2 = null): void{
        $table->id();
        MigHelper::ref($table, $column1, $indexBoth, false, $refTable1);
        MigHelper::ref($table, $column2, true, false, $refTable2);
        $table->unique([$column1, $column2]);
    }

    /**
     * Shortcut for bool column. Indexed and true by default.
     */
    public static function bool(Blueprint $table, string $colName): void{
        $table->boolean($colName)->default(true)->index();
    }

    /**
     * Shortcut to make an ID column and a unique string, or (non-unique) text column if $isLong.
     */
    public static function idTxt(Blueprint $table, string $txtColName, bool $isLong = false): void{
        $table->id();
        $isLong ? $table->text($txtColName) : $table->string($txtColName, 255)->unique();
    }
}
