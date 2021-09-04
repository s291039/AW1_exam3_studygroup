/**
 * Information about a group being passed
 */

class Group {
	/**
	 * Constructs a new Group object
	 * @param {String} course_code unique code for the course
	 * @param {String} course_name name of the group
	 * @param {Number} course_credits credits of the group
	 * @param {String} group_color color of the group
	 * @param {String} group_creation_date creation date of the group
	 */
	constructor(course_code, course_name, course_credits, group_color, group_creation_date) {
		this.course_code = course_code;
		this.course_name = course_name;
		this.course_credits = course_credits;
		this.group_color = group_color;
		this.group_creation_date = group_creation_date
		this.students_number = 0;   // will fill this in App.js
	}

	/**
	 * Construct an Group from a plain object
	 * @param {{}} json 
	 * @return {Group} the newly created Group object
	 */
	static from(json) {
		return new Group(json.course_code, json.course_name, json.course_credits, json.group_color, json.group_creation_date);
	}
}

export default Group;
