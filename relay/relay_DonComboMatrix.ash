// don_combo WaterSheep matrix launcher.
// Read-only: player/day runtime context is provided by installed kol-goblin-docs.
void main() {
  string target = "don_combo_matrix.html?player=" + my_id() + "&gameday=" + gameday_to_int();
  writeln("<!doctype html>");
  writeln("<html><head><meta charset='utf-8'><title>don_combo matrix</title></head>");
  writeln("<body style='margin:0;background:#091018;color:#eef4f8;font-family:system-ui,sans-serif'>");
  writeln("<p style='padding:16px'>Opening <a style='color:#82b7ff' href='" + target + "'>don_combo Shadow Route Lab</a>...</p>");
  writeln("<script>window.location.replace('" + target + "');</script>");
  writeln("</body></html>");
}
