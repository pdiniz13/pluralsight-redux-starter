import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as courseActions from '../../actions/courseActions';
import CourseForm from './CourseForm';
import {authorsFormattedForDropDown} from '../../selectors/selectors.js';
import toastr from 'toastr';

export class ManageCoursePage extends React.Component {
    constructor(props, context){
        super(props, context);

        this.state = {
            course: Object.assign({}, props.course),
            errors: {},
            saving: false
        };

        this.updateCourseState = this.updateCourseState.bind(this);
        this.saveCourse = this.saveCourse.bind(this);
    }

    componentWillReceiveProps(nextProps){
        if(this.props.course.id !== nextProps.course.id){
            this.setState({course: Object.assign({}, nextProps.course)});
        }
    }

    updateCourseState(event) {
        const field = event.target.name;
        let course = this.state.course;
        course[field] = event.target.value;
        return this.setState({course: course});
    }

    courseFormIsValid() {
        let formIsValid = true;
        let errors = {};

        if(this.state.course.title.length < 5){
            errors.title = 'Title must be at least 5 characters.';
            formIsValid = false;
        }
        this.setState({errors: errors});
        return formIsValid;
    }

    saveCourse(event){
        event.preventDefault();
        if (!this.courseFormIsValid()){
            return;
        }
        this.setState({saving: true});
        this.props.actions.saveCourse(this.state.course).then(() => this.redirect())
            .catch(error => {
                this.setState({saving: false});
                toastr.error(error);
            });
    }

    redirect(){
        this.setState({saving: false});
        toastr.success('Course Saved');
        this.context.router.push('/courses');
    }

    render() {
        return (
            <CourseForm
                allAuthors={this.props.authors}
                onChange={this.updateCourseState}
                onSave={this.saveCourse}
                course={this.state.course}
                errors={this.state.errors}
                saving={this.state.saving}
            />
        );
    }
}

ManageCoursePage.propTypes = {
    course: PropTypes.object.isRequired,
    authors: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired
};


ManageCoursePage.contextTypes = {
    router: PropTypes.object
};

let getCourseById = function(courses, id){
    for(let x = 0, count = courses.length; x < count; x++){
        let course = courses[x];
        if(id === course.id){
            return course;
        }
    }
    return null;
};

let mapStateToProps = function(state, ownProps){
    const courseId = ownProps.params.id;

    let course = {id: '', watchHref: '', title: '', authorId: '', length: '', category: ''};

    if(courseId && state.courses.length) {
        course = getCourseById(state.courses, courseId);
    }

    return {
        course: course,
        authors: authorsFormattedForDropDown(state.authors)
    };
};

let mapDispatchToProps = function(dispatch){
    return {
        actions: bindActionCreators(courseActions, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageCoursePage);
