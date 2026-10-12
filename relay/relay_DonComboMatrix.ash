// don_combo WaterSheep matrix launcher.
// Read-only with respect to KoL: writes local evaluation context only.
void main() {
  int player = my_id();
  int gameday = gameday_to_int();

  buffer context;
  context.append("{\"schema\":\"don-combo-matrix-context/v0.3\",\"player\":");
  context.append(player);
  context.append(",\"gameday\":");
  context.append(gameday);
  context.append("}");
  buffer_to_file(context, "don_combo_matrix_context.json");

  string target = "don_combo_matrix.html?player=" + player + "&gameday=" + gameday;
  writeln("<!doctype html>");
  writeln("<html><head><meta charset='utf-8'><title>don_combo matrix</title></head>");
  writeln("<body style='margin:0;background:#091018;color:#eef4f8;font-family:system-ui,sans-serif'>");
  writeln("<p style='padding:16px'>Opening <a style='color:#82b7ff' href='" + target + "'>don_combo Shadow Route Lab</a>...</p>");
  writeln("<script>window.location.replace('" + target + "');</script>");
  writeln("</body></html>");
}
