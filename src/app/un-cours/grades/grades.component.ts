import { Component, Input, OnInit } from '@angular/core';
import { NotesService } from '../../services/notes.service';
import { Notes } from '../../../models/notes.model';
import { UsersService } from '../../services/users.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-grades',
  templateUrl: './grades.component.html',
  styleUrls: ['./grades.component.css']
})
export class GradesComponent implements OnInit {
  @Input() courseId!: string;
  @Input() userRole!: string;

  isTeacher: boolean = false;
  grades: Notes[] = [];
  students: any[] = [];
  gradeForm: FormGroup;
  selectedGrade: Notes | null = null;
  editMode: boolean = false;
  currentUser: User | null = null;

  constructor(
    private notesService: NotesService,
    private usersService: UsersService,
    private fb: FormBuilder
  ) {
    this.gradeForm = this.fb.group({
      studentId: ['', Validators.required],
      value: ['', [Validators.required, Validators.min(0), Validators.max(20)]],
      comment: [''],
      assignmentName: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.isTeacher = this.userRole === 'teacher' || this.userRole === 'admin';

    // Get current user first, then load grades
    this.usersService.getCurrentUser().subscribe(
      user => {
        this.currentUser = user;
        this.loadGrades();
      },
      error => console.error('Error loading current user:', error)
    );

    if (this.isTeacher) {
      this.loadStudents();
    }
  }

  loadGrades(): void {
    this.notesService.getNotesByCourse(this.courseId).subscribe(
      grades => {
        this.grades = grades;

        // If student, filter only their grades
        if (!this.isTeacher && this.currentUser) {
          const currentUserId = this.currentUser._id;
          this.grades = this.grades.filter(grade => grade.studentId === currentUserId);
        }
      },
      error => console.error('Error loading grades:', error)
    );
  }

  loadStudents(): void {
    // This would need to call an API endpoint to get students in this course
    // For now, we'll leave it empty as we don't have the method yet
    // this.usersService.getStudentsByCourse(this.courseId).subscribe(...)
  }

  onAddGrade(): void {
    if (this.gradeForm.valid && this.isTeacher && this.currentUser) {
      const newGrade = new Notes(
        this.gradeForm.value.studentId,
        this.courseId,
        this.gradeForm.value.value,
        new Date(),
        this.currentUser._id || '', // Added fallback empty string to ensure it's always a string
        this.gradeForm.value.comment,
        undefined,
        this.gradeForm.value.assignmentName
      );

      this.notesService.createNote(newGrade).subscribe(
        grade => {
          this.grades.push(grade);
          this.gradeForm.reset();
        },
        error => console.error('Error adding grade:', error)
      );
    }
  }

  onEditGrade(grade: Notes): void {
    this.selectedGrade = grade;
    this.editMode = true;
    this.gradeForm.patchValue({
      studentId: grade.studentId,
      value: grade.value,
      comment: grade.comment || '',
      assignmentName: grade.assignmentName || ''
    });
  }

  onUpdateGrade(): void {
    if (this.gradeForm.valid && this.selectedGrade && this.isTeacher) {
      const updatedGrade = {
        value: this.gradeForm.value.value,
        comment: this.gradeForm.value.comment,
        assignmentName: this.gradeForm.value.assignmentName,
        timestamp: new Date()
      };

      this.notesService.updateNote(this.selectedGrade._id || '', updatedGrade).subscribe(
        grade => {
          const index = this.grades.findIndex(g => g._id === grade._id);
          if (index !== -1) {
            this.grades[index] = grade;
          }
          this.cancelEdit();
        },
        error => console.error('Error updating grade:', error)
      );
    }
  }

  onDeleteGrade(gradeId: string): void {
    if (this.isTeacher && confirm('Are you sure you want to delete this grade?')) {
      this.notesService.deleteNote(gradeId).subscribe(
        () => {
          this.grades = this.grades.filter(grade => grade._id !== gradeId);
        },
        error => console.error('Error deleting grade:', error)
      );
    }
  }

  cancelEdit(): void {
    this.editMode = false;
    this.selectedGrade = null;
    this.gradeForm.reset();
  }

  // Helper function to get student name (would need actual implementation)
  getStudentName(studentId: string): string {
    const student = this.students.find(s => s._id === studentId);
    return student ? student.name : studentId;
  }
}
