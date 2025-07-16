import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyForm } from './policy-form';

describe('PolicyForm', () => {
  let component: PolicyForm;
  let fixture: ComponentFixture<PolicyForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolicyForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolicyForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
