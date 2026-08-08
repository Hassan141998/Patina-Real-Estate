"""Populate the database with demo listings and a demo agent account.

CLI usage:
    python seed.py

This module also exposes populate(), used by the /api/admin/seed HTTP
endpoint (see routes/admin.py) — handy on hosts like Render's free tier,
which don't support Shell/SSH access for running one-off scripts.
"""

from extensions import db
from models import Agent, Listing

LISTINGS = [
    dict(
        id="MW-014", name="The Kiln House", address="14 Munsey Way, Hudson Valley, NY",
        price=1285000, type="Detached", status="For Sale", beds=4, baths=3, sqft=3120,
        year_built=1961,
        description=(
            "A reclaimed brick kiln converted into a single-story residence, "
            "wrapped around a central courtyard that once housed the firing chamber."
        ),
    ),
    dict(
        id="PR-004", name="Patina Row No. 4", address="4 Cannery Row, Providence, RI",
        price=640000, type="Townhouse", status="For Sale", beds=3, baths=2, sqft=1840,
        year_built=1904,
        description=(
            "End-unit rowhouse with the original copper cornice left to weather "
            "naturally. Full-height sash windows on both street elevations."
        ),
    ),
    dict(
        id="GB-021", name="The Glasshouse Barn", address="21 Quarry Road, Kingston, NY",
        price=975000, type="Barn Conversion", status="Under Offer", beds=3, baths=2, sqft=2460,
        year_built=1888,
        description=(
            "Timber-frame dairy barn re-clad in glass on its south face. Original "
            "hay-loft beams remain exposed throughout the second floor."
        ),
    ),
    dict(
        id="SC-009", name="Sable Court Studio", address="9 Sable Court, Beacon, NY",
        price=415000, type="Live/Work Loft", status="For Sale", beds=1, baths=1, sqft=980,
        year_built=1932,
        description=(
            "Former textile workshop with 11-foot ceilings and a single run of "
            "north-facing sawtooth skylights that never see direct sun."
        ),
    ),
    dict(
        id="FL-112", name="Foundry Lane 112", address="112 Foundry Lane, Troy, NY",
        price=812000, type="Semi-Detached", status="For Sale", beds=3, baths=2, sqft=2050,
        year_built=1949,
        description=(
            "Mid-century semi with its original board-formed concrete retaining "
            "wall still holding back the hillside garden out back."
        ),
    ),
    dict(
        id="WD-007", name="Weir Dam Cottage", address="7 Millrace Lane, New Paltz, NY",
        price=555000, type="Cottage", status="Sold", beds=2, baths=1, sqft=1120,
        year_built=1917,
        description=(
            "One-and-a-half-story miller's cottage set beside a working weir; "
            "the sound of the spillway is audible from every room."
        ),
    ),
    dict(
        id="WT-002", name="The Water Tower Loft", address="2 Reservoir Rd, Hudson, NY",
        price=890000, type="Industrial Conversion", status="For Sale", beds=2, baths=2, sqft=1560,
        year_built=1923,
        description=(
            "A decommissioned municipal water tower reworked into a vertical "
            "three-story loft; the original steel tank now forms the primary "
            "bedroom's curved ceiling."
        ),
    ),
    dict(
        id="FH-018", name="Firehouse No. 3", address="18 Ladder Street, Peekskill, NY",
        price=725000, type="Firehouse Conversion", status="For Sale", beds=3, baths=2, sqft=2200,
        year_built=1911,
        description=(
            "Twin apparatus bay doors slide open onto what's now the living room; "
            "the brass pole remains, connecting the ground floor to the loft above."
        ),
    ),
    dict(
        id="SH-005", name="Maple Street Schoolhouse", address="5 Maple Street, Catskill, NY",
        price=610000, type="Schoolhouse Conversion", status="Under Offer", beds=2, baths=1, sqft=1680,
        year_built=1898,
        description=(
            "A one-room schoolhouse with its slate chalkboard wall left intact; "
            "south-facing windows once sized for classroom light now flood the kitchen."
        ),
    ),
    dict(
        id="CH-011", name="Chapel on Elm", address="11 Elm Street, Hoosick Falls, NY",
        price=540000, type="Chapel Conversion", status="For Sale", beds=2, baths=2, sqft=1940,
        year_built=1887,
        description=(
            "Vaulted ceilings and a rose window survive from the building's century "
            "as a Methodist chapel; the choir loft is now a reading room."
        ),
    ),
    dict(
        id="IH-006", name="Icehouse Cottage", address="6 Millpond Lane, Warren, RI",
        price=465000, type="Icehouse Conversion", status="For Sale", beds=1, baths=1, sqft=860,
        year_built=1904,
        description=(
            "Thick insulated walls built to keep ice frozen through summer now keep "
            "the cottage naturally cool; the loading dock is a covered porch."
        ),
    ),
    dict(
        id="FM-023", name="Feed Mill No. 23", address="23 Grain Street, Pawtucket, RI",
        price=735000, type="Mill Conversion", status="Sold", beds=3, baths=2, sqft=2380,
        year_built=1929,
        description=(
            "Grain chutes were removed, but the timber hopper framing above the "
            "kitchen was kept as exposed structure; the loading crane track still "
            "spans the exterior wall."
        ),
    ),

    # --- Apartments ---
    dict(
        id="AP-001", name="Textile Lofts, Unit 4B", address="4 Canal Street, Holyoke, MA",
        price=289000, type="Apartment", status="For Sale", beds=1, baths=1, sqft=720,
        year_built=1888,
        description=(
            "A single-bedroom unit inside a converted textile mill; original iron "
            "window mullions remain, sized for the looms that once stood beside them."
        ),
    ),
    dict(
        id="AP-002", name="Rail Depot Flats, Unit 2", address="2 Depot Plaza, Newburgh, NY",
        price=310000, type="Apartment", status="For Sale", beds=2, baths=1, sqft=940,
        year_built=1904,
        description=(
            "Second-floor apartment above the town's former passenger depot; the "
            "platform awning still shades the private entrance below."
        ),
    ),
    dict(
        id="AP-003", name="The Cannery Apartments, Unit 5", address="5 Wharf Street, New Haven, CT",
        price=265000, type="Apartment", status="Under Offer", beds=1, baths=1, sqft=680,
        year_built=1912,
        description=(
            "Ground-floor unit in a former oyster cannery; the concrete floor still "
            "carries a faint drainage channel from its packing-house days."
        ),
    ),
    dict(
        id="AP-004", name="Grain Exchange Residences, Unit 12", address="12 Exchange Row, Pawtucket, RI",
        price=345000, type="Apartment", status="For Sale", beds=2, baths=2, sqft=1080,
        year_built=1897,
        description=(
            "Corner unit in the old grain exchange, with the trading floor's oak "
            "wainscoting preserved along the living room wall."
        ),
    ),
    dict(
        id="AP-005", name="Print Shop Flats, Unit 3", address="3 Press Alley, Northampton, MA",
        price=298000, type="Apartment", status="For Sale", beds=1, baths=1, sqft=760,
        year_built=1921,
        description=(
            "Above a former print shop; a bricked-in loading chute for paper "
            "deliveries is now a built-in bookshelf niche."
        ),
    ),
    dict(
        id="AP-006", name="Union Hall Apartments, Unit 7", address="7 Assembly Street, Pittsfield, MA",
        price=252000, type="Apartment", status="Sold", beds=1, baths=1, sqft=690,
        year_built=1909,
        description=(
            "A former labor union meeting hall split into flats; the unit retains "
            "one of the hall's original arched windows."
        ),
    ),

    # --- Retail / shops ---
    dict(
        id="RT-001", name="Corner Storefront on Main", address="101 Main Street, Kingston, NY",
        price=420000, type="Retail/Shop", status="For Sale", beds=0, baths=1, sqft=1400,
        year_built=1901,
        description=(
            "Ground-floor retail space with full-height display windows on two "
            "street frontages; last operated as a hardware store for six decades."
        ),
    ),
    dict(
        id="RT-002", name="The Old Pharmacy Building", address="44 Market Street, Poughkeepsie, NY",
        price=385000, type="Retail/Shop", status="For Sale", beds=0, baths=1, sqft=1150,
        year_built=1893,
        description=(
            "Pressed-tin ceiling and the original pharmacy counter remain in place; "
            "zoned for retail or a small studio practice."
        ),
    ),
    dict(
        id="RT-003", name="Depot Street Storefront", address="9 Depot Street, Hudson, NY",
        price=350000, type="Retail/Shop", status="Under Offer", beds=0, baths=1, sqft=980,
        year_built=1915,
        description=(
            "Narrow storefront with a deep back room once used for cold storage; "
            "street-facing awning tracks are still bolted above the entrance."
        ),
    ),
    dict(
        id="RT-004", name="Cobbler's Row Shop", address="17 Cobbler's Row, Beacon, NY",
        price=295000, type="Retail/Shop", status="For Sale", beds=0, baths=1, sqft=820,
        year_built=1888,
        description=(
            "One of a row of former tradesmen's shopfronts; the cobbler's fitted "
            "workbench along the rear wall was left in place by the current owner."
        ),
    ),
    dict(
        id="RT-005", name="Millworks Retail Suite", address="30 Millworks Way, Providence, RI",
        price=460000, type="Retail/Shop", status="For Sale", beds=0, baths=2, sqft=1620,
        year_built=1884,
        description=(
            "Double-height retail suite on the ground floor of a converted textile "
            "mill, with the building's original freight elevator still operable."
        ),
    ),
    dict(
        id="RT-006", name="Harness Shop Storefront", address="5 Church Street, New Paltz, NY",
        price=310000, type="Retail/Shop", status="For Sale", beds=0, baths=1, sqft=900,
        year_built=1897,
        description=(
            "Former leather and harness shop with the original tin ceiling and a "
            "hand-painted sign still legible on the transom glass."
        ),
    ),

    # --- Office buildings ---
    dict(
        id="OF-001", name="The Telegraph Office Building", address="8 Wire Street, Troy, NY",
        price=575000, type="Office Building", status="For Sale", beds=0, baths=2, sqft=2100,
        year_built=1889,
        description=(
            "Three floors of office suites in the city's former telegraph "
            "exchange; conduit runs from the old switchboard room are still visible."
        ),
    ),
    dict(
        id="OF-002", name="Bank Row Offices", address="21 Bank Row, Bridgeport, CT",
        price=690000, type="Office Building", status="For Sale", beds=0, baths=3, sqft=2850,
        year_built=1902,
        description=(
            "A converted savings bank; the ground-floor vault door is retained as "
            "a conference-room feature, still on its original hinges."
        ),
    ),
    dict(
        id="OF-003", name="Courthouse Annex Suites", address="14 Courthouse Square, Catskill, NY",
        price=515000, type="Office Building", status="Under Offer", beds=0, baths=2, sqft=1980,
        year_built=1911,
        description=(
            "Former county records annex, now split into four office suites; "
            "fireproof file-room doors remain on two of them."
        ),
    ),
    dict(
        id="OF-004", name="Freight House Offices", address="6 Freight House Row, Peekskill, NY",
        price=480000, type="Office Building", status="For Sale", beds=0, baths=2, sqft=2200,
        year_built=1908,
        description=(
            "Open-plan offices under the freight house's original queen-post "
            "roof trusses; loading dock doors now open onto a private courtyard."
        ),
    ),
    dict(
        id="OF-005", name="The Assay Office", address="3 Foundry Lane, Hoosick Falls, NY",
        price=440000, type="Office Building", status="For Sale", beds=0, baths=1, sqft=1750,
        year_built=1894,
        description=(
            "Compact office building that once tested ore samples from nearby "
            "mills; the assay lab's stone counters remain in the ground-floor suite."
        ),
    ),
    dict(
        id="OF-006", name="Exchange Building Suites", address="19 Exchange Place, New Haven, CT",
        price=620000, type="Office Building", status="For Sale", beds=0, baths=2, sqft=2400,
        year_built=1899,
        description=(
            "Second and third floor suites above a former commodities exchange; "
            "the trading floor's skylight now lights a shared stairwell below."
        ),
    ),

    # --- Warehouse / mixed-use ---
    dict(
        id="WH-001", name="Cold Storage Warehouse Lofts", address="12 Icehouse Row, Warren, RI",
        price=680000, type="Mixed-Use Building", status="For Sale", beds=0, baths=2, sqft=3200,
        year_built=1919,
        description=(
            "Ground-floor commercial space with two loft apartments above; "
            "18-inch insulated walls from its cold-storage days keep it quiet."
        ),
    ),
    dict(
        id="WH-002", name="The Tannery Building", address="27 Tannery Lane, Newburgh, NY",
        price=725000, type="Mixed-Use Building", status="For Sale", beds=0, baths=3, sqft=3600,
        year_built=1876,
        description=(
            "Former leather tannery reworked into ground-floor studios with two "
            "residential units above; the tanning pits are now a sunken courtyard."
        ),
    ),
    dict(
        id="WH-003", name="Loom City Mixed-Use", address="8 Loom Street, Holyoke, MA",
        price=795000, type="Mixed-Use Building", status="Sold", beds=0, baths=3, sqft=4100,
        year_built=1883,
        description=(
            "A full mill floor divided into retail, office, and residential "
            "space; the original belt-drive line shaft still runs the length of the ceiling."
        ),
    ),
    dict(
        id="WH-004", name="Anchor Works Building", address="40 Anchor Street, Providence, RI",
        price=850000, type="Mixed-Use Building", status="For Sale", beds=0, baths=3, sqft=3950,
        year_built=1891,
        description=(
            "Former marine hardware works with a street-level workshop and two "
            "upper floors of live/work space; the loading crane rail is still bolted overhead."
        ),
    ),
    dict(
        id="WH-005", name="The Powerhouse", address="5 Turbine Way, Pittsfield, MA",
        price=910000, type="Mixed-Use Building", status="For Sale", beds=0, baths=2, sqft=4400,
        year_built=1907,
        description=(
            "A decommissioned power station with its turbine hall left mostly "
            "open; currently zoned for gallery, studio, or event use."
        ),
    ),
    dict(
        id="WH-006", name="Freight Yard Commons", address="16 Yard Street, Poughkeepsie, NY",
        price=670000, type="Mixed-Use Building", status="Under Offer", beds=0, baths=2, sqft=3100,
        year_built=1913,
        description=(
            "Former rail freight office with an attached open-span warehouse; "
            "track-side loading doors now serve as the building's main entrance."
        ),
    ),
]


def populate():
    """Wipe and rebuild the listings/agent tables. Must be called inside an
    active app context (either via seed()'s CLI wrapper, or from within a
    running Flask request, as routes/admin.py does)."""
    db.drop_all()
    db.create_all()

    for data in LISTINGS:
        db.session.add(Listing(**data))

    agent = Agent(username="agent", name="Dana Whitfield", email="dana@patina.example")
    agent.set_password("patina2026")
    db.session.add(agent)

    db.session.commit()
    return len(LISTINGS)


def seed():
    # Imported here, not at module level, so that routes/admin.py can import
    # populate() from this module without triggering a circular import
    # (app.py imports routes/admin.py while it's still being defined).
    from app import create_app

    app = create_app()
    with app.app_context():
        count = populate()
        print(f"Seeded {count} listings and 1 agent account.")
        print("Demo login -> username: agent  password: patina2026")


if __name__ == "__main__":
    seed()
