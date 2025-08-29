import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ProfessionalListComponent } from './professional-list.component';
import { ProfessionalFormComponent } from '../professional-form/professional-form.component';
import { Page } from '../../../../core/models/page.model';
import { Professional } from '../../../../core/models/professional.model';
import { ProfessionalService } from '../../../../core/services/professional.service';
import { ToastService } from '../../../../core/services/toast.service';

describe('ProfessionalListComponent', () => {
  let component: ProfessionalListComponent;
  let fixture: ComponentFixture<ProfessionalListComponent>;
  let professionalServiceSpy: jasmine.SpyObj<ProfessionalService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;

  beforeEach(async () => {
    // Create spy objects with the methods we want to fake
    const pServiceSpy = jasmine.createSpyObj('ProfessionalService', ['getProfissionais', 'delete']);
    const tServiceSpy = jasmine.createSpyObj('ToastService', ['showSuccess', 'showError']);

    await TestBed.configureTestingModule({
      declarations: [ ProfessionalListComponent ],
      providers: [
        // Provide the fake services instead of the real ones
        { provide: ProfessionalService, useValue: pServiceSpy },
        { provide: ToastService, useValue: tServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfessionalListComponent);
    component = fixture.componentInstance;

    // Get the instances of our spies from the test injector
    professionalServiceSpy = TestBed.inject(ProfessionalService) as jasmine.SpyObj<ProfessionalService>;
    toastServiceSpy = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load professionals on init', () => {
    // 1. Arrange: Create a complete mock Page object
    const mockPage: Page<Professional> = {
      content: [{ id: 1, name: 'Test Professional', email: 'test@email.com', phone: '123', active: true, areas: [] }],
      pageable: { sort: { sorted: true, unsorted: false, empty: false }, pageNumber: 0, pageSize: 10, offset: 0, paged: true, unpaged: false },
      last: true, totalPages: 1, totalElements: 1, sort: { sorted: true, unsorted: false, empty: false }, first: true,
      size: 10, number: 0, numberOfElements: 1, empty: false
    };
    // Configure the spy to return the mock data
    professionalServiceSpy.getProfissionais.and.returnValue(of(mockPage));

    // 2. Act: Call ngOnInit
    fixture.detectChanges();

    // 3. Assert: Check if the component's 'page' property was updated correctly
    expect(component.page).toBeDefined();
    expect(component.page?.content.length).toBe(1);
    expect(component.page?.content[0].name).toBe('Test Professional');
    expect(professionalServiceSpy.getProfissionais).toHaveBeenCalledWith(0, 10, '');
  });

  it('should set title and open modal when openModalForNew is called', () => {
    // Arrange: To test a @ViewChild, we create a mock object for it and assign it to the component instance
    const mockModal = jasmine.createSpyObj('ModalComponent', ['open']);
    const mockForm = jasmine.createSpyObj('ProfessionalFormComponent', ['resetForm']);
    component.formModal = mockModal;
    component.formComponent = mockForm;

    // Act: Call the component's method
    component.openModalForNew();

    // Assert: Check if the modal title was set and the modal's open method was called
    expect(component.modalTitle).toBe('Novo Profissional');
    expect(mockModal.open).toHaveBeenCalled();
    expect(mockForm.resetForm).toHaveBeenCalled();
  });
});