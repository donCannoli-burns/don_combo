// don_combo cooperative interrupt relay control.
//
// Selecting this relay script never issues a KoL action. It only asks an
// already-running Combo invocation to stop at its next safe boundary. Combo
// finishes any in-flight beach comb and observation trace before returning.

void main() {
    boolean running = get_property("don_combo_running") == "true";
    string status = "idle";
    string message = "No active don_combo run. Nothing was interrupted.";

    if (running) {
        set_property("don_combo_interrupt", "true");
        status = "queued";
        message = "Interrupt queued. don_combo will stop cleanly after the current comb finishes.";
    } else {
        // Do not leave a stale request behind for the next invocation.
        set_property("don_combo_interrupt", "false");
    }

    string target = "don_combo_matrix.html?player=" + my_id() + "&gameday=" + gameday_to_int();

    writeln("<!doctype html>");
    writeln("<html><head><meta charset='utf-8'><title>don_combo interrupt</title></head>");
    writeln("<body style='margin:0;background:#091018;color:#eef4f8;font-family:system-ui,sans-serif'>");
    writeln("<main style='max-width:760px;margin:48px auto;padding:20px;border:1px solid #26384a;border-radius:10px;background:#101923'>");
    writeln("<div id='don-combo-interrupt-result' data-status='" + status + "'>");
    writeln("<h1 style='font-size:22px;margin:0 0 10px'>don_combo · cooperative interrupt</h1>");
    writeln("<p style='color:#cdd8e1'>" + message + "</p>");
    writeln("<p style='color:#96a8b8'>This control only sets a local stop-request preference. It does not cancel an in-flight KoL request or issue a new KoL action.</p>");
    writeln("<p><a style='color:#82b7ff' href='" + target + "'>Return to Shadow Route Lab</a></p>");
    writeln("</div>");
    writeln("</main>");
    writeln("</body></html>");
}
