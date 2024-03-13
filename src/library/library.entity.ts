// library.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Student } from '../student/student.entity';

@Entity()
export class LibraryRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Student, (student) => student.libraryRecords)
  
  student: Student;
  


  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  checkInTime: Date;

  @Column({ type: 'timestamp', default: null, nullable: true })
  checkOutTime: Date;

  @Column({ length: 50 })
  registrationNumber: string;

  // Additional columns for student's branch and name
  @Column({ length: 50, nullable: true })
  studentBranch: string;

  @Column({ length: 255, nullable: true })
  studentName: string;
}
