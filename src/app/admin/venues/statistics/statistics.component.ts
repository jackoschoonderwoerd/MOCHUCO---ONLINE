import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VenuesService } from '../venues.service';
import { Venue, Item, ItemVisit, ItemNameAndVisitsPerItem, AllVisits } from '../../../shared/models';
import { ItemsService } from '../items/items.service';
import { FormControl, FormGroup } from '@angular/forms';
import { filter } from 'rxjs';

@Component({
    selector: 'app-statistics',
    templateUrl: './statistics.component.html',
    styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {


    itemNameAndVisitsPerItem: ItemNameAndVisitsPerItem[] = []
    panelOpenState: boolean = false;
    venue: Venue;

    range = new FormGroup({
        start: new FormControl(null),
        end: new FormControl(null),
    });

    constructor(
        private route: ActivatedRoute,
        private venuesService: VenuesService,
        private itemsService: ItemsService

    ) { }

    ngOnInit(): void {
        this.route.params.subscribe((params: any) => {
            if (!params) {
                alert('no params, no venue id')
            } else {
                const venueId = params.venueId
                this.venuesService.getVenueById(venueId).subscribe((venue: Venue) => {
                    this.venue = venue
                })

                const itemSubscription = this.itemsService.getItems(venueId)
                    .subscribe((items: Item[]) => {
                        items.forEach((item: Item) => {
                            this.venuesService.getVisits(venueId, item.id)
                                .subscribe((itemVisits: ItemVisit[]) => {
                                    console.log(itemVisits)
                                    const itemName = item.name
                                    this.itemNameAndVisitsPerItem.push({ itemName, itemVisits })
                                    this.itemNameAndVisitsPerItem = this.sortItemNameAndVisitsPerItem(this.itemNameAndVisitsPerItem);
                                    console.log(this.itemNameAndVisitsPerItem);
                                })
                        })
                        // itemSubscription.unsubscribe()
                    })
            }
        })
    }
    sortItemNameAndVisitsPerItem(itemNameAndVisitsPerItem: ItemNameAndVisitsPerItem[]) {
        itemNameAndVisitsPerItem.forEach((itemNameAndVisitPerItem) => {
            itemNameAndVisitPerItem.itemVisits.sort((a, b) => {
                return a.timestamp - b.timestamp
            })
        })
        return itemNameAndVisitsPerItem
    }
    onDateChange(e) {
        console.log(e);
        console.log(this.range)
        const start = new Date(this.range.value.start).getTime();
        const end = new Date(this.range.value.end).getTime();
        console.log(start, end);
        this.itemNameAndVisitsPerItem.forEach(itemNameAndVisitPerItem => {
            itemNameAndVisitPerItem.itemVisits.forEach((itemVisit: ItemVisit) => {

            })
        })
    }
}
