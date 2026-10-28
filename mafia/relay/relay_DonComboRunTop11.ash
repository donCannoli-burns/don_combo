// Two-step, user-confirmed top-11 shadow route launcher.
// No browser-provided tile coordinates are accepted. Combo independently
// validates the frozen local ranking and every free action boundary.
void main() {
    string [string] fields = form_fields();
    string action = fields["action"];
    string status = "idle";
    string message = "Open DonComboMatrix and choose Review top 11 free route.";
    int remaining = 11 - to_int(get_property("_freeBeachWalksUsed"));
    if (remaining < 0) remaining = 0;
    boolean running = get_property("don_combo_running") == "true";
    string token = "";

    if (action == "preview") {
        if (running || remaining == 0) {
            status = "blocked";
            message = running ? "Combo is already running." : "All 11 free beach combs have been used today.";
        } else {
            token = now_to_string("yyyyMMddHHmmss") + "-" + random(1000000000);
            set_property("don_combo_shadow11_token", token);
            set_property("don_combo_shadow11_token_owner", to_string(my_id()));
            set_property("don_combo_shadow11_token_day", to_string(gameday_to_int()));
            status = "preview";
            message = "This runs up to " + remaining +
              " of the highest-ranked, tide-accessible known rare coordinates from the saved shadow table. " +
              "The snapshot must be less than 20 minutes old and belong to this player and game day. " +
              "Only free beach combs may be used. No WaterSheep calls can change the route mid-run.";
        }
    } else if (action == "execute") {
        string expected = get_property("don_combo_shadow11_token");
        boolean valid = expected != "" && fields["token"] == expected &&
          get_property("don_combo_shadow11_token_owner") == to_string(my_id()) &&
          get_property("don_combo_shadow11_token_day") == to_string(gameday_to_int());
        // Consume the token before any KoL action, even on a failed attempt.
        set_property("don_combo_shadow11_token", "");
        if (!valid || running || remaining == 0) {
            status = "blocked";
            message = "Confirmation expired, Combo is active, or no free combs remain. Refresh the matrix and review again.";
        } else {
            status = "completed";
            boolean ok = cli_execute("call don_combo/don_combo_listener.ash combo shadow11");
            if (!ok || get_property("don_combo_last_run_status") == "failed") {
                status = "failed";
                message = "Shadow route refused or stopped; check the KoLmafia CLI for the exact reason.";
            } else {
                message = "Shadow route ended: " + get_property("don_combo_last_run_status") +
                    ". Free combs performed: " + get_property("don_combo_last_run_combs") +
                    ". End reason: " + get_property("don_combo_last_run_end_reason") + ".";
            }
        }
    }
    string target = "don_combo_matrix.html?player=" + my_id() + "&gameday=" + gameday_to_int();
    writeln("<!doctype html><html><head><meta charset='utf-8'><title>don_combo · Shadow 11</title></head>");
    writeln("<body style='margin:0;background:#091018;color:#eef4f8;font:15px system-ui,sans-serif'>");
    writeln("<main style='max-width:760px;margin:48px auto;padding:20px;border:1px solid #26384a;border-radius:10px;background:#101923'>");
    writeln("<div id='don-combo-shadow11-result' data-status='" + status + "'>");
    writeln("<h1>DonCombo · WaterSheep top 11</h1>");
    writeln("<p>" + entity_encode(message) + "</p>");
    if (status == "preview") {
        writeln("<p style='color:#f4c56a'>These WaterSheep scores are experimental, not validated rare-spawn probabilities. Once confirmed, Combo executes the frozen route, without paid combs or implicit replanning.</p>");
        writeln("<form method='POST' action='relay_DonComboRunTop11.ash'>");
        writeln("<input type='hidden' name='action' value='execute'>");
        writeln("<input type='hidden' name='token' value='" + token + "'>");
        writeln("<button type='submit' style='padding:11px 16px;background:#82b7ff;color:#091018;border:0;border-radius:6px;cursor:pointer'>Confirm and run free route</button>");
        writeln("</form>");
    }
    writeln("<p><a style='color:#82b7ff' href='" + target + "'>Return to Shadow Route Lab</a></p>");
    writeln("</div></main></body></html>");
}
