import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dialog-box',
  templateUrl: './dialog-box.component.html',
  styleUrls: ['./dialog-box.component.scss']
})
export class DialogBoxComponent implements OnInit {
  public repoUrl;
  public imageUrl;
  onAdd = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<DialogBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.repoUrl = window.location.href;
    if (this.data.image) {
      this.imageUrl = this.data.image;
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  onConfirm() {
    this.onAdd.emit();
  }
}
