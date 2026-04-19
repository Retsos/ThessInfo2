"""Parsing utilities for recycling data.

Handles Greek month abbreviations and comma-formatted number strings
found in the raw recycle.json dataset.
"""

from __future__ import annotations

# Greek month abbreviation → month number
GREEK_MONTHS: dict[str, int] = {
    "Ιαν": 1,
    "Φεβ": 2,
    "Μαρ": 3,
    "Απρ": 4,
    "Μαϊ": 5,
    "Ιουν": 6,
    "Ιουλ": 7,
    "Αυγ": 8,
    "Σεπ": 9,
    "Οκτ": 10,
    "Νοε": 11,
    "Δεκ": 12,
}

MONTH_NAMES: dict[int, str] = {
    1: "Ιανουάριος",
    2: "Φεβρουάριος",
    3: "Μάρτιος",
    4: "Απρίλιος",
    5: "Μάιος",
    6: "Ιούνιος",
    7: "Ιούλιος",
    8: "Αύγουστος",
    9: "Σεπτέμβριος",
    10: "Οκτώβριος",
    11: "Νοέμβριος",
    12: "Δεκέμβριος",
}


def parse_number(val: str | None) -> float | None:
    """Convert a comma-formatted string to float.

    Returns None for empty strings, None values, or unparseable input.
    Examples:
        "324,520"  → 324520.0
        "1,051,104" → 1051104.0
        "5.86"     → 5.86
        ""         → None
        None       → None
    """
    if val is None or val == "":
        return None

    try:
        return float(val.replace(",", ""))
    except (TypeError, ValueError):
        return None


def parse_month_key(key: str) -> tuple[int, int] | None:
    """Parse a Greek month-year header like 'Ιαν-24' into (year, month).

    Returns (2024, 1) for 'Ιαν-24', or None if the key isn't a month header.
    Two-digit years are mapped: 23→2023, 24→2024, etc.
    """
    parts = key.split("-")
    if len(parts) != 2:
        return None

    abbrev, year_suffix = parts
    month = GREEK_MONTHS.get(abbrev)
    if month is None:
        return None

    try:
        year = 2000 + int(year_suffix)
    except ValueError:
        return None

    return (year, month)
