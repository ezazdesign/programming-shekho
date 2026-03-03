const courseData = {
    html: {
        title: "HTML5",
        icon: "layout",
        colorClass: "text-orange",
        chapters: []
    },
    css: {
        title: "CSS3",
        icon: "edit-3",
        colorClass: "text-blue",
        chapters: []
    },
    js: {
        title: "JavaScript",
        icon: "code",
        colorClass: "text-yellow",
        chapters: []
    }
};

// Safely merge dynamically loaded CourseData blocks from the modular JS files
if (typeof window.htmlCourseData !== 'undefined') {
    Object.assign(courseData.html, window.htmlCourseData);
}
if (typeof window.cssCourseData !== 'undefined') {
    Object.assign(courseData.css, window.cssCourseData);
}
if (typeof window.jsCourseData !== 'undefined') {
    Object.assign(courseData.js, window.jsCourseData);
}

// Expose it to global variables
window.courseData = courseData;