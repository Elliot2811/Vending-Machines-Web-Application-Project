// Here is a sample back end code which show how we perform validation in the api and return proper error message to the calling function or client eg postman

app.route('/api/users')
 .post(function(req, res) {
   const { name, email, age } = req.body;
   const errors = [];
   // Manual validation
   if (!name || name.length < 3 || name.length > 50) {
     errors.push('Name must be between 3 and 50 characters long');
   }
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   if (!email || !emailRegex.test(email)) {
     errors.push('Please provide a valid email address');
   }
   if (!age || !Number.isInteger(age) || age < 1 || age > 120) {
     errors.push('Age must be a number between 1 and 120');
   }
   if (errors.length > 0) {
     // If there are validation errors, return them before executing the query
     return res.status(400).json({ errors });
   }
   // If validation passes, proceed with query execution (to be added later)
   res.status(201).json({ message: 'Validation passed, ready to execute query' });
 });