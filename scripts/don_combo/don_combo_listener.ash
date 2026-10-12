// don_combo callable wrapper.
// Control-plane only: writes a flat KoLmafia map request, invokes the typed
// runtime synchronously, and returns. Combo remains the sole KoL action owner.

string strip_ws(string value) {
    matcher edges = create_matcher("^\\s+|\\s+$", value);
    return replace_all(edges, "");
}

string request_id() {
    return now_to_string("yyyyMMddHHmmss") + "-" + my_id() + "-" + random(1000000);
}

string queue_request(string capability, string action, string reason, string event, string meta, string page) {
    string id = request_id();
    string [string] request;
    request["schema"] = "kol-runtime-request/v1";
    request["id"] = id;
    request["capability"] = capability;
    request["action"] = action;
    request["reason"] = reason;
    request["authority"] = "none";
    if (event != "") request["event"] = event;
    if (meta != "") request["meta"] = meta;
    if (page != "") request["page"] = page;

    string path = "agent-runtime/inbox/" + id + ".txt";
    if (!map_to_file(request, path)) {
        print("don_combo listener: failed to write runtime request " + path, "red");
        return "";
    }
    return path;
}

boolean refresh_context(string reason) {
    if (!git_exists("donCannoli-burns-kol-goblin-docs")) return false;
    return cli_execute("call kol-goblin-docs.ash refresh " + reason);
}

void run_runtime(string path) {
    if (path == "") return;
    cli_execute("call don_combo/don_combo_runtime.js process " + path);
}

void main(string command) {
    command = strip_ws(command);

    if (command == "" || command == "refresh") {
        refresh_context("combo-matrix");
        run_runtime(queue_request("don-combo-matrix", "refresh", "combo-matrix", "", "", ""));
        return;
    }

    if (command == "smoke" || command == "smoke excavator") {
        run_runtime(queue_request(
            "excavator-smoke",
            "smoke",
            "manual-smoke",
            "choice",
            "excavator-compatible",
            "<html data-smoke='don_combo'></html>"
        ));
        return;
    }

    if (starts_with(command, "combo")) {
        string args = "";
        if (length(command) > 5) args = strip_ws(substring(command, 5));

        string invoke = "call combo/combo.js";
        if (args != "") invoke = invoke + " " + args;
        if (!cli_execute(invoke)) {
            print("don_combo listener: Combo invocation failed; shadow refresh skipped.", "red");
            return;
        }

        refresh_context("combo-finished");
        run_runtime(queue_request("don-combo-matrix", "refresh", "combo-finished", "", "", ""));
        return;
    }

    if (starts_with(command, "refresh ")) {
        string reason = strip_ws(substring(command, 8));
        refresh_context(reason);
        run_runtime(queue_request("don-combo-matrix", "refresh", reason, "", "", ""));
        return;
    }

    print("don_combo listener: use combo <n>, refresh [reason], or smoke excavator.", "red");
}
