import { Component, NgZone, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<TestComponent>,
    private ngZone: NgZone
  ) { }

  ngOnInit(): void {
  }
  onClose() {
    alert('closing window')
    this.ngZone.run(() => {
      this.dialogRef.close(console.log('ref closing'));
      this.dialogRef.close();
    })
  }

}
