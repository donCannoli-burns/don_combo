// Explicit, read-only matrix refresh endpoint.
// Browser reload is NOT a runtime refresh: this listener rebuilds the native
// evidence and WaterSheep comparison before acknowledging the result.
// No KoL beach actions, confirmation tokens, or execution authority.
void main() {
    string previous = get_property("don_combo_matrix_refresh_generation");
    string status = "blocked";
    string message = "Refresh did not complete.";
    if (get_property("don_combo_running") == "true") {
        message = "Combo is still running. Stop or finish the run before refreshing/exporting.";
    } else {
        boolean invoked = cli_execute("call don_combo/don_combo_listener.ash refresh combo-matrix-manual");
        string generation = get_property("don_combo_matrix_refresh_generation");
        if (invoked && generation != "" && generation != previous &&
            get_property("don_combo_running") != "true") {
            status = "refreshed";
            message = "Native runtime regenerated and ready for browser readback.";
        } else {
            message = "Native runtime did not commit a new generation. Check the KoLmafia CLI; old evidence will not be exported.";
        }
    }
    // Only the native runtime stamps these properties after writing both
    // runtime.json and relay runtime.js. The browser independently validates
    // the fetched JS generation/events/status before enabling an export.
    writeln("<!doctype html><html><head><meta charset='utf-8'><title>DonCombo refresh</title></head><body>");
    writeln("<main id='don-combo-refresh-result' data-status='" + status +
        "' data-generation='" + entity_encode(get_property("don_combo_matrix_refresh_generation")) +
        "' data-events='" + entity_encode(get_property("don_combo_matrix_refresh_events")) +
        "' data-run-status='" + entity_encode(get_property("don_combo_matrix_refresh_run_status")) +
        "' data-player='" + my_id() +
        "' data-gameday='" + gameday_to_int() + "'>");
    writeln("<p>" + entity_encode(message) + "</p>");
    writeln("</main></body></html>");
}
