import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LibraryRecord } from './library.entity';
import { Student } from '../student/student.entity';

@Injectable()
export class LibraryService {
  constructor(
    @InjectRepository(LibraryRecord)
    private libraryRecordRepository: Repository<LibraryRecord>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
  ) {}

  async recordEntry(registrationNumber: string): Promise<LibraryRecord> {
    const student = await this.studentRepository.findOne({
      where: { registrationNumber },
    });

    if (!student) {
      throw new NotFoundException('Student not found with the given registration number');
    }

    const libraryRecord = new LibraryRecord();
    libraryRecord.student = student;
    libraryRecord.studentBranch = student.branch; // Assuming Student entity has a 'branch' property
    libraryRecord.studentName = student.name;
    
    return this.libraryRecordRepository.save(libraryRecord);
  }

  async recordExit(registrationNumber: string): Promise<LibraryRecord> {
    const student = await this.studentRepository.findOne({
      where: { registrationNumber },
    });

    if (!student) {
      throw new NotFoundException('Student not found with the given registration number');
    }

    const activeCheckInRecord = await this.libraryRecordRepository.findOne({
      where: { student: { id: student.id }, checkOutTime: null },
    });

    if (!activeCheckInRecord) {
      throw new BadRequestException('No active check-in record found for the given registration number');
    }

    activeCheckInRecord.checkOutTime = new Date();
    return this.libraryRecordRepository.save(activeCheckInRecord);
  }
}
