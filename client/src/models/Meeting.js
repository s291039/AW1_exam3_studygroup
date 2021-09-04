/**
 * Information about a meeting being passed
 */

class Meeting {
	/**
	 * Constructs a new Meeting object
	 * @param {Integer} meeting_id unique id for the meeting
	 * @param {String} course_name name for the course
	 * @param {String} meeting_datetime date and time of the meeting
	 * @param {Integer} meeting_duration duration of the meeting
	 * @param {String} meeting_place place of the meeting
	 */
	constructor(meeting_id, course_name, meeting_datetime, meeting_duration, meeting_place) {
		this.meeting_id = meeting_id;
		this.course_name = course_name;
		this.meeting_datetime = meeting_datetime;
		this.meeting_duration = meeting_duration;
		this.meeting_place = meeting_place;
		this.students_number = 0;   // will fill this in App.js
	}

	/**
	 * Construct an Meeting from a plain object
	 * @param {{}} json
	 * @return {Meeting} the newly created Meeting object
	 */
	static from(json) {
		return new Meeting(json.meeting_id, json.course_name, json.meeting_datetime, json.meeting_duration, json.meeting_place);
	}
}

export default Meeting;
