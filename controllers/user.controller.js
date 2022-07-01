
const login = (req, res) => {
    let user_mail = req.query.email
	let password = req.query.password

	//open connection
	var connection = mySql.createConnection(connectionParams)

	if (user_mail && password) {
		connection.query(
			"select * from users where email = ? and password = ?",
			[user_mail, password],
			(err, result, field) => {
				if (result && result.length > 0) {
					let userdetail = {
						email: result[0].email,
						username: result[0].username,
						password: result[0].password,
						profile_pic: result[0].profile_pic,
						dob: result[0].dob,
						phone_no: result[0].phone_no,
						address: result[0].address,
						user_id: result[0].user_id
					}
					res.send({ message: "login success", user: userdetail })
				} else {
					res.send({ message: "email not exists", user: undefined })
				}
			}
		)
	}

}

const register = (req, res) => {
    var user_details = {
		email: req.query.email,
		username: req.query.username,
		password: req.query.password,
		profile_pic: baseUrl + "profile/" + req.query.profile_pic_name,
		dob: req.query.dob,
		address: req.query.address,
		phone_no: req.query.phone_no
	}

	//open connection
	var connection = mySql.createConnection(connectionParams)

	if (user_details.email) {
		connection.query(
			"select * from users where email = ?",
			[user_details.email],
			(err, result, field) => {
				if (err) {
					res.send({ message: "something went wrong" })
				} else if (result && result.length > 0) {
					res.send({ message: "email exists" })
				} else {
					connection.query(
						"insert into  users (email, password, profile_pic, dob, phone_no, address, username) values (?, ?, ?, ?, ?, ?, ?)",
						[
							user_details.email,
							user_details.password,
							user_details.profile_pic,
							user_details.dob,
							user_details.phone_no,
							user_details.address,
							user_details.username
						],
						(err, result, field) => {
							if (err) {
								res.send({ message: "something went wrong" })
							} else if (result.affectedRows > 0) {
								res.send({ message: "added successfully" })
							}
						}
					)
				}
			}
		)
	}


}

module.exports = {
    login,
    register
}