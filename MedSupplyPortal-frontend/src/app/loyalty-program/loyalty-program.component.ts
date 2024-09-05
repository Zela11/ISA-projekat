import { Component } from '@angular/core';
import { LoyaltyProgram } from '../shared/model/loyaltyProgram';
import { LoyaltyProgramService } from '../services/loyaltyProgram/loyalty-program.service';
import { CategoryScale } from '../shared/model/categoryScale';
import { UserService } from '../services/user/user.service';

@Component({
  selector: 'app-loyalty-program',
  templateUrl: './loyalty-program.component.html',
  styleUrls: ['./loyalty-program.component.css']
})
export class LoyaltyProgramComponent {
  loyaltyProgram: any = {
    pointsPerPickup: 0,
    categoryScales: []
  };
  newCategoryScale: any = {
    name: '',
    minimumPoints: 0,
    penaltyThreshold: 0,
    discount: 0
  };
  isProgramCreated = false;
  categories: CategoryScale[] = [];
  selectedCategoryForEdit: any = null;

  constructor(private loyaltyProgramService: LoyaltyProgramService, private userService: UserService) { }

  ngOnInit(): void {
    this.loadLoyaltyProgram(); // Refactor to use a separate method for loading data
  }

  loadLoyaltyProgram(): void {
    this.loyaltyProgramService.getLoyaltyProgram().subscribe(
      (response: LoyaltyProgram[] | null) => {
        if (response && response.length > 0) {
          this.loyaltyProgram = response[0];
          this.categories = this.loyaltyProgram.categoryScales;
          this.isProgramCreated = true;
        } else {
          this.isProgramCreated = false;
        }
      },
      (error: any) => {
        console.error('Error fetching loyalty program', error);
      }
    );
  }

  createLoyaltyProgram(): void {
    this.loyaltyProgramService.createLoyaltyProgram({ pointsPerPickup: this.loyaltyProgram.pointsPerPickup }).subscribe(
      () => {
        this.isProgramCreated = true;
        alert('Loyalty Program created successfully!');
        this.loadLoyaltyProgram(); // Reload the program to reflect changes
      },
      (error) => {
        console.error('Error creating loyalty program', error);
      }
    );
  }

  addCategoryScale(): void {
    const newScale = { ...this.newCategoryScale };
    this.loyaltyProgramService.addCategoryScale(newScale).subscribe(
      (response: CategoryScale) => {
        if (response) {
          this.loyaltyProgram.categoryScales = response;
          this.newCategoryScale = { name: '', minimumPoints: 0, penaltyThreshold: 0, discount: 0 };
          this.loadLoyaltyProgram();
          alert('Category added successfully!');
        }
      },
      (error) => {
        console.error('Error adding category scale', error);
      }
    );
  }

  deleteLoyaltyProgram(): void {
    this.loyaltyProgramService.deleteLoyaltyProgram().subscribe(
      () => {
        this.isProgramCreated = false;
        this.loyaltyProgram = {
          pointsPerPickup: 0,
          categoryScales: [],
        };
        this.userService.deleteCategoryNames().subscribe(
          () => {
            alert('Loyalty Program deleted and users updated successfully!');
          },
          (error) => {
            console.error('Error updating users after deleting loyalty program', error);
            alert('Loyalty Program deleted but failed to update users.');
          }
        );
        alert('Loyalty Program deleted successfully!');
      },
      (error) => {
        console.error('Error deleting loyalty program', error);
      }
    );
  }

  deleteCategory(categoryName: string): void {
    this.loyaltyProgramService.deleteCategoryScale(categoryName).subscribe(
      () => {
        alert(`Category ${categoryName} deleted successfully!`);
        this.loadLoyaltyProgram(); // Reload to update the UI
      },
      (error) => {
        console.error('Error deleting category', error);
      }
    );
  }

  selectCategoryForEdit(category: any) {
    this.selectedCategoryForEdit = { ...category };
  }

  updateCategoryScale() {
    if (this.selectedCategoryForEdit) {
      this.loyaltyProgramService.editCategoryScale(this.selectedCategoryForEdit).subscribe(
        (response: CategoryScale) => {
          if (response) {
            this.loadLoyaltyProgram()
            this.selectedCategoryForEdit = null;
            alert('Category updated successfully!');
          }
        },
        (error) => {
          console.error('Error editing category', error);
        }
      );
    }
  }

  cancelEdit() {
    this.selectedCategoryForEdit = null; 
  }
  saveUserCategoryChanges(): void {
    this.userService.updateUserCategories().subscribe(
      () => {
        alert('User categories updated successfully!');
      },
      (error) => {
        console.error('Error updating user categories', error);
      }
    );
  }
}
