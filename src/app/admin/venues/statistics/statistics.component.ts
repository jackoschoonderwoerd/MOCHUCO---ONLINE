import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VenuesService } from '../venues.service';
import { Venue, Item, ItemVisit, ItemNameAndVisitsPerItem, AllVisits, ItemNameAndVisitPerItem } from '../../../shared/models';
import { ItemsService } from '../items/items.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, filter, map, take } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

@Component({
    selector: 'app-statistics',
    templateUrl: './statistics.component.html',
    styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {


    itemNameAndVisitsPerItem: ItemNameAndVisitsPerItem[] = []
    newItemNameAndVisitsPerItem: any[] = []
    itemNameAndVisitsPerItem$: Observable<ItemNameAndVisitsPerItem[]>;
    items$: Observable<Item[]>;
    itemVisits$: Observable<ItemVisit[]>
    panelOpenState: boolean = false;
    venue: Venue;
    itemVisitsArray: any[] = []
    start: number;
    end: number;
    range = new FormGroup({
        start: new FormControl(null),
        end: new FormControl(null),
    });
    dataPresent: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private venuesService: VenuesService,
        private itemsService: ItemsService,
        public authService: AuthService

    ) { }
    ngOnInit(): void {
        this.route.params.subscribe((params: any) => {
            if (!params) {
                alert('no params, no venue id')
            } else {
                const venueId = params.venueId;
                this.venuesService.getVenueById(venueId).subscribe((venue: Venue) => {
                    this.venue = venue;
                })
                console.log(venueId)

                this.items$ = this.itemsService.getItems(venueId)



            }
        })
    }

    onGetItemVisits() {
        this.clear();
        this.dataPresent = false;
        this.items$.subscribe((items: Item[]) => {
            items.forEach((item: Item) => {
                this.itemNameAndVisitsPerItem.push({ itemName: item.name, itemVisits: [] })
                this.getItemVisits(this.venue.id, item.id, item.name)
            })
            console.log(this.itemNameAndVisitsPerItem)
        })
    }

    getItemVisits(venueId: string, itemId: string, itemName: string) {
        this.itemVisits$ = this.venuesService.getVisits(venueId, itemId, this.start, this.end)
        this.itemVisits$.subscribe((itemVisits: ItemVisit[]) => {

            console.log(itemVisits);
            let likesCount = 0
            itemVisits.forEach((itemVisit: ItemVisit) => {
                if (itemVisit.liked) {
                    likesCount = likesCount + 1;
                }
                const index = this.itemNameAndVisitsPerItem.findIndex((itemNameAndVisitPerItem: any) => {
                    return itemNameAndVisitPerItem.itemName == itemName;
                });
                this.itemNameAndVisitsPerItem[index].likes = likesCount;
                this.itemNameAndVisitsPerItem[index].itemVisits.push({
                    timestamp: itemVisit.timestamp,
                    liked: itemVisit.liked,
                    id: itemVisit.id
                })

            })
            this.itemNameAndVisitsPerItem = this.sortItemNameAndVisitsPerItem(this.itemNameAndVisitsPerItem);

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
        this.dataPresent = true;
        this.clear();
        console.log(e);
        console.log(e.value);
        if (!e.value) {
            console.log('no dates selected')
        } else {
            console.log('dates selected')
            this.onGetItemVisits();
        }
        console.log(this.range)
        this.start = new Date(this.range.value.start).getTime();
        // add 86400000 to get the end of the selected day, otherwise 'end' starts at the beginning of the selected day
        this.end = new Date(this.range.value.end).getTime() + 86400000 - 1;
        console.log(this.start, this.end);
    }
    clear() {
        this.itemNameAndVisitsPerItem = [];
    }

    // ********************************************************************
    // ngOnInit(): void {
    //     this.route.params.subscribe((params: any) => {
    //         if (!params) {
    //             alert('no params, no venue id')
    //         } else {
    //             const venueId = params.venueId;
    //             this.venuesService.getVenueById(venueId).subscribe((venue: Venue) => {
    //                 this.venue = venue;
    //             })
    //             console.log(venueId)

    //             this.items$ = this.itemsService.getItems(venueId)

    //             this.items$.subscribe((items: Item[]) => {
    //                 items.forEach((item: Item) => {
    //                     this.newItemNameAndVisitsPerItem.push({ itemName: item.name, itemVisits: [] })
    //                     this.getItemVisits(venueId, item.id, item.name)
    //                 })
    //             })

    //         }
    //     })
    // }

    // getItemVisits(venueId: string, itemId: string, itemName: string) {
    //     this.itemVisits$ = this.venuesService.getVisits(venueId, itemId)
    //     this.itemVisits$.subscribe((itemVisits: ItemVisit[]) => {
    //         itemVisits.forEach((itemVisit: ItemVisit) => {
    //             const index = this.newItemNameAndVisitsPerItem.findIndex((itemNameAndVisitPerItem: ItemNameAndVisitPerItem) => {
    //                 return itemNameAndVisitPerItem.itemName == itemName;
    //             });
    //             this.newItemNameAndVisitsPerItem[index].itemVisits.push({
    //                 timestamp: itemVisit.timestamp,
    //                 liked: itemVisit.liked,
    //                 id: itemVisit.id
    //             })
    //         })
    //         this.newItemNameAndVisitsPerItem = this.sortItemNameAndVisitsPerItem(this.newItemNameAndVisitsPerItem);
    //     })

    // }


    // sortItemNameAndVisitsPerItem(itemNameAndVisitsPerItem: ItemNameAndVisitsPerItem[]) {
    //     itemNameAndVisitsPerItem.forEach((itemNameAndVisitPerItem) => {
    //         itemNameAndVisitPerItem.itemVisits.sort((a, b) => {
    //             return a.timestamp - b.timestamp
    //         })
    //     })
    //     return itemNameAndVisitsPerItem
    // }

    // onDateChange(e) {
    //     console.log(e);
    //     console.log(this.range)
    //     const start = new Date(this.range.value.start).getTime();
    //     const end = new Date(this.range.value.end).getTime();
    //     console.log(start, end);
    // }

    // ******************************************
    // getItems(venueId: string) {
    //     this.itemsService.getItems(venueId)
    //         .subscribe((items: Item[]) => {
    //             console.log('GETTING ITEMS')
    //             items.forEach((item: Item) => {
    //                 this.venuesService.getVisits(venueId, item.id)
    //                     .subscribe((itemVisits: ItemVisit[]) => {
    //                         console.log(itemVisits)
    //                         const itemName = item.name
    //                         this.itemNameAndVisitsPerItem.push({ itemName, itemVisits })
    //                         this.itemNameAndVisitsPerItem = this.sortItemNameAndVisitsPerItem(this.itemNameAndVisitsPerItem);
    //                     })
    //             })
    //         })
    // }
}
