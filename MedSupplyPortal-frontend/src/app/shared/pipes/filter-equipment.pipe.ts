import { Pipe, PipeTransform } from '@angular/core';
import { Equipment } from '../model/equipment';

@Pipe({
  name: 'filterEquipment'
})
export class FilterEquipmentPipe implements PipeTransform {

  transform(equipmentList: Equipment[], searchQuery: string): Equipment[] {
    if (!searchQuery) {
      return equipmentList;
    }
    return equipmentList.filter(equipment =>
      equipment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      equipment.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
}