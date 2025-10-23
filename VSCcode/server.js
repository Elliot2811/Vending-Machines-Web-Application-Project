var express = require("express");
var db = require("./db-connections")
var app = express();

app.use(express.json());
app.use(express.static("./public"));

app.route("/vending_machine").get(function(req, res) {
    var sql = "SELECT a.vending_machine_id AS id, b.school AS school, b.block AS block, b.floor AS floor, d.payment_name AS payment_name FROM vending_machine.vending_machine a INNER JOIN vending_machine.location b ON a.location_id = b.location_id INNER JOIN vending_machine.vending_payment c ON a.vending_machine_id = c.vending_id INNER JOIN vending_machine.payment_method d ON c.payment_id = d.payment_id ORDER BY b.block";

    db.query(sql, function(error, result) {
        if(error) throw error;
        else res.json(result);
    });
});

app.route("/vending_machine/filter_school/:school").get(function(req, res) {
    var sql = "SELECT a.vending_machine_id AS id, b.school AS school, b.block AS block, b.floor AS floor, d.payment_name AS payment_name FROM vending_machine.vending_machine a INNER JOIN vending_machine.location b ON a.location_id = b.location_id INNER JOIN vending_machine.vending_payment c ON a.vending_machine_id = c.vending_id INNER JOIN vending_machine.payment_method d ON c.payment_id = d.payment_id WHERE b.school = ? ORDER BY b.block";
    var parameter = [req.params.school];

    db.query(sql, parameter, function(error, result) {
        if(error) throw error;
        else res.json(result);
    });
});

app.route("/vending_machine_item/:id").get(function(req, res) {
    var sql = "SELECT a.item_id AS id, a.item_name AS name, a.item_cost AS cost, a.item_image AS image, a.availability AS availability FROM vending_machine.item a INNER JOIN vending_machine.vending_item b ON a.item_id = b.item_id WHERE b.vending_machine_id = ?";
    var parameter = [req.params.id];
    
    db.query(sql, parameter, function(error, result) {
        if(error) throw error;
        else res.json(result);
    });
})

app.route("/vending_machine_item/:id/filter_name/:name").get(function(req, res) {
    var sql = "SELECT a.item_id AS id, a.item_name AS name, a.item_cost AS cost, a.item_image AS image, a.availability AS availability FROM vending_machine.item a INNER JOIN vending_machine.vending_item b ON a.item_id = b.item_id WHERE b.vending_machine_id = ? AND a.item_name LIKE ?";
    var parameter = [req.params.id, "%" + req.params.name + "%"];

    db.query(sql, parameter, function(error, result) {
        if(error) throw error;
        else res.json(result);
    });
})

app.route("/vending_machine_item/:id/filter_order/ASC").get(function(req, res) {
    var sql = "SELECT a.item_id AS id, a.item_name AS name, a.item_cost AS cost, a.item_image AS image, a.availability AS availability FROM vending_machine.item a INNER JOIN vending_machine.vending_item b ON a.item_id = b.item_id WHERE b.vending_machine_id = ? ORDER BY a.item_cost ASC";
    var parameter = [req.params.id, "%" + req.params.name + "%"];

    db.query(sql, parameter, function(error, result) {
        if(error) throw error;
        else res.json(result);
    });
})

app.route("/vending_machine_item/:id/filter_order/DESC").get(function(req, res) {
    var sql = "SELECT a.item_id AS id, a.item_name AS name, a.item_cost AS cost, a.item_image AS image, a.availability AS availability FROM vending_machine.item a INNER JOIN vending_machine.vending_item b ON a.item_id = b.item_id WHERE b.vending_machine_id = ? ORDER BY a.item_cost DESC";
    var parameter = [req.params.id, "%" + req.params.name + "%"];

    db.query(sql, parameter, function(error, result) {
        if(error) throw error;
        else res.json(result);
    });
})


app.route("/vending_machine_item/:id/filter_nameorder/:name/ASC").get(function(req, res) {
    var sql = "SELECT a.item_id AS id, a.item_name AS name, a.item_cost AS cost, a.item_image AS image, a.availability AS availability FROM vending_machine.item a INNER JOIN vending_machine.vending_item b ON a.item_id = b.item_id WHERE b.vending_machine_id = ? AND a.item_name LIKE ? ORDER BY a.item_cost ASC";
    var parameter = [req.params.id, "%" + req.params.name + "%"];

    db.query(sql, parameter, function(error, result) {
        if(error) throw error;
        else res.json(result);
    });
})

app.route("/vending_machine_item/:id/filter_nameorder/:name/DESC").get(function(req, res) {
    var sql = "SELECT a.item_id AS id, a.item_name AS name, a.item_cost AS cost, a.item_image AS image, a.availability AS availability FROM vending_machine.item a INNER JOIN vending_machine.vending_item b ON a.item_id = b.item_id WHERE b.vending_machine_id = ? AND a.item_name LIKE ? ORDER BY a.item_cost DESC";
    var parameter = [req.params.id, "%" + req.params.name + "%"];

    db.query(sql, parameter, function(error, result) {
        if(error) throw error;
        else res.json(result);
    });
})

app.route("/vending_machine_item/:id").delete(function(req, res) {
    var sql = "DELETE FROM vending_machine.vending_item WHERE vending_machine_id = ? AND item_id = ?";
    var parameter = [req.params.id, req.body.item_id];

    db.query(sql, parameter, function(error, result) {
        if(error) throw error;
        else res.json(result);
    })
})

app.route("/vending_machine_item/add_item/:id").get(function(req, res) {
    var sql = "SELECT a.item_id AS id, a.item_name AS name, a.item_cost AS cost, a.item_image AS image, a.availability AS availability FROM vending_machine.item a WHERE a.item_id NOT IN (SELECT b.item_id FROM vending_machine.vending_item b WHERE b.vending_machine_id = ?)";
    var parameter = [req.params.id];

    db.query(sql, parameter, function(error, result) {
        if(error) throw error;
        else res.json(result);
    });
})

app.route("/vending_machine_item/add_item/:id/filter_name/:name").get(function(req, res) {
    var sql = "SELECT a.item_id AS id, a.item_name AS name, a.item_cost AS cost, a.item_image AS image, a.availability AS availability FROM vending_machine.item a WHERE a.item_id NOT IN (SELECT b.item_id FROM vending_machine.vending_item b WHERE b.vending_machine_id = ?) AND a.item_name LIKE ?";
    var parameter = [req.params.id, "%" + req.params.name + "%"];

    db.query(sql, parameter, function(error, result) {
        if(error) throw error;
        else res.json(result);
    });
})

app.route("/vending_machine_item/add_item/:id/filter_order/ASC").get(function(req, res) {
    var sql = "SELECT a.item_id AS id, a.item_name AS name, a.item_cost AS cost, a.item_image AS image, a.availability AS availability FROM vending_machine.item a WHERE a.item_id NOT IN (SELECT b.item_id FROM vending_machine.vending_item b WHERE b.vending_machine_id = ?) ORDER BY a.item_cost ASC";
    var parameter = [req.params.id];

    db.query(sql, parameter, function(error, result) {
        if(error) throw error;
        else res.json(result);
    });
})

app.route("/vending_machine_item/add_item/:id/filter_order/DESC").get(function(req, res) {
    var sql = "SELECT a.item_id AS id, a.item_name AS name, a.item_cost AS cost, a.item_image AS image, a.availability AS availability FROM vending_machine.item a WHERE a.item_id NOT IN (SELECT b.item_id FROM vending_machine.vending_item b WHERE b.vending_machine_id = ?) ORDER BY a.item_cost DESC";
    var parameter = [req.params.id];

    db.query(sql, parameter, function(error, result) {
        if(error) throw error;
        else res.json(result);
    });
})

app.route("/vending_machine_item/add_item/:id/filter_nameorder/:name/ASC").get(function(req, res) {
    var sql = "SELECT a.item_id AS id, a.item_name AS name, a.item_cost AS cost, a.item_image AS image, a.availability AS availability FROM vending_machine.item a WHERE a.item_id NOT IN (SELECT b.item_id FROM vending_machine.vending_item b WHERE b.vending_machine_id = ?) AND a.item_name LIKE ? ORDER BY a.item_cost ASC";
    var parameter = [req.params.id, "%" + req.params.name + "%"];

    db.query(sql, parameter, function(error, result) {
        if(error) throw error;
        else res.json(result);
    });
})

app.route("/vending_machine_item/add_item/:id/filter_nameorder/:name/DESC").get(function(req, res) {
    var sql = "SELECT a.item_id AS id, a.item_name AS name, a.item_cost AS cost, a.item_image AS image, a.availability AS availability FROM vending_machine.item a WHERE a.item_id NOT IN (SELECT b.item_id FROM vending_machine.vending_item b WHERE b.vending_machine_id = ?) AND a.item_name LIKE ? ORDER BY a.item_cost DESC";
    var parameter = [req.params.id, "%" + req.params.name + "%"];

    db.query(sql, parameter, function(error, result) {
        if(error) throw error;
        else res.json(result);
    });
})


app.route("/vending_machine_item/add_item/:id").post(function(req, res) {
    var sql = "INSERT INTO vending_machine.vending_item (vending_machine_id, item_id) VALUES (?, ?)";
    var parameter = [req.params.id, req.body.item_id];

    db.query(sql, parameter, function(error, result) {
        if(error) throw error;
        else res.json(result);
    })
})

app.route("/item").get(function(req, res) {
    var sql = "SELECT a.item_id AS id, a.item_name AS name, a.item_cost AS cost, a.item_image AS image, a.availability AS availability, a.item_quantity AS quantity FROM vending_machine.item a";

    db.query(sql, function(error, result) {
        if(error) throw error;
        else res.json(result);
    });
})

app.route("/item/filter_name/:name").get(function(req, res) {
    var sql = "SELECT a.item_id AS id, a.item_name AS name, a.item_cost AS cost, a.item_image AS image, a.availability AS availability, a.item_quantity AS quantity FROM vending_machine.item a WHERE a.item_name LIKE ?";
    var parameter = ["%" + req.params.name + "%"];
    
    db.query(sql, parameter, function(error, result) {
        if(error) throw error;
        else res.json(result);
    });
})

app.route("/item/filter_order/ASC").get(function(req, res) {
    var sql = "SELECT a.item_id AS id, a.item_name AS name, a.item_cost AS cost, a.item_image AS image, a.availability AS availability, a.item_quantity AS quantity FROM vending_machine.item a ORDER BY a.item_cost ASC";
    
    db.query(sql, function(error, result) {
        if(error) throw error;
        else res.json(result);
    });
})

app.route("/item/filter_order/DESC").get(function(req, res) {
    var sql = "SELECT a.item_id AS id, a.item_name AS name, a.item_cost AS cost, a.item_image AS image, a.availability AS availability, a.item_quantity AS quantity FROM vending_machine.item a ORDER BY a.item_cost DESC";
    
    db.query(sql, function(error, result) {
        if(error) throw error;
        else res.json(result);
    });
})

app.route("/item/filter_nameorder/:name/ASC").get(function(req, res) {
    var sql = "SELECT a.item_id AS id, a.item_name AS name, a.item_cost AS cost, a.item_image AS image, a.availability AS availability, a.item_quantity AS quantity FROM vending_machine.item a WHERE a.item_name LIKE ? ORDER BY a.item_cost ASC";
    var parameter = ["%" + req.params.name + "%"];

    db.query(sql, parameter, function(error, result) {
        if(error) throw error;
        else res.json(result);
    });
})

app.route("/item/filter_nameorder/:name/DESC").get(function(req, res) {
    var sql = "SELECT a.item_id AS id, a.item_name AS name, a.item_cost AS cost, a.item_image AS image, a.availability AS availability, a.item_quantity AS quantity FROM vending_machine.item a WHERE a.item_name LIKE ? ORDER BY a.item_cost DESC";
    var parameter = ["%" + req.params.name + "%"];
    
    db.query(sql, parameter, function(error, result) {
        if(error) throw error;
        else res.json(result);
    });
})

app.route("/item").post(function(req, res) {
    var errors = [];

    if(!req.body.name || req.body.name < 3 || req.body.name > 50) errors.push("Name must be between 3 and 50 characters long");
    if(req.body.cost <= 0 || req.body.cost > 10) errors.push("Cost must be between $0.01 to $10.00");
    if(req.body.availability != 0 && req.body.availability != 1) errors.push("Availability can only be 0 or 1, unavailable and available respectively");
    if(req.body.quantity < 0) errors.push("Quantity cannot be negative");
    if(errors.length > 0) return res.status(400).json({errors});

    var sql = "INSERT INTO vending_machine.item (item_name, item_cost, item_image, availability, item_quantity) VALUES (?, ?, ?, ?, ?)";
    var parameter = [req.body.name, req.body.cost, req.body.image_url, req.body.availability, req.body.quantity];

    db.query(sql, parameter, function(error, result) {
        if(error) throw error;
        else res.json(result);
    });
})

app.route("/item").put(function(req, res) {
    var errors = [];

    if(!req.body.name || req.body.name < 3 || req.body.name > 50) errors.push("Name must be between 3 and 50 characters long");
    if(req.body.cost <= 0 || req.body.cost > 10) errors.push("Cost must be between $0.01 to $10.00");
    if(req.body.availability != 0 && req.body.availability != 1) errors.push("Availability can only be 0 or 1, unavailable and available respectively");
    if(req.body.quantity < 0) errors.push("Quantity cannot be negative");
    if(errors.length > 0) return res.status(400).json({errors});

    var sql = "UPDATE vending_machine.item SET item_name = ?, item_cost = ?, item_image = ?, availability = ?, item_quantity = ? WHERE item_id = ?";
    var parameter = [req.body.name, req.body.cost, req.body.image_url, req.body.availability, req.body.quantity, req.body.id];

    db.query(sql, parameter, function(error, result) {
        if(error) throw error;
        else res.json(result);
    });
})

app.route("/item").delete(function(req, res) {
    var sql = "DELETE FROM vending_machine.item WHERE item_id = ?"
    var parameter = [req.body.id];

    db.query(sql, parameter, function(error, result) {
        if(error) throw error;
        else res.json(result);
    })
})

app.use(function handleNotFound(req, res) {
    res.status(404).json({
        error: "Route not found",
        route: req.originalUrl
    });
})

app.listen(8080, "127.0.0.1");
console.log("Webserver running at @ https://127.0.0.1:8080");