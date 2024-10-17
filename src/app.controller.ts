import { Controller, Get, Render, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Post } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { Response } from 'express';
import { Reservation } from './reservation.dto';
import { error } from 'console';

class Errors {
  name: boolean;
  name_text : string;

  email: boolean;
  email_text: string;

  date: boolean;
  date_text: string;

  seats: boolean;
  seats_text: string;
}
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  getHello() {
    return {
      message: this.appService.getHello()
    };
  }


  @Get('reservation')
  @Render('reservation')
  getReservation() {
    return {
      data:{},
      errors: {},
    }
  }
  @Post('reservation')
  postReservation(@Body() reservationDto: Reservation, @Res() res:Response){
    const errors: Errors = new Errors()

    if(!reservationDto.name){
      errors.name = true;
      errors.name_text = "Must be filled out!"
    }

    if(!reservationDto.email){
      errors.email = true;
      errors.email_text = "Must be filled out!";
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(reservationDto.email)){
        errors.date = true;
        errors.date_text = "Invalid email address!"
    }
    //Date
    if(!reservationDto.date){
      errors.date = true;
      errors.date_text ="Must be filled out!"
    }
    if(Date.parse(reservationDto.date.toString()) < Date.now()){
      errors.date = true;
      errors.date_text = "Nop"
    }
    //Seats
    if(!reservationDto.seats){
      errors.seats = true;
      errors.seats_text = "Must be filled out!"
    }
    if(reservationDto.seats > 10) {
      errors.seats = true;
      errors.seats_text = "The max value is 10!"
    }
    if(reservationDto.seats < 1) {
      errors.seats = true;
      errors.seats_text = "The minimum value is 1!"
    }
    if (errors.name || errors.date || errors.email || errors.seats) {
      console.log(errors)
      res.render('reservation', {
        data: reservationDto,
        errors
      })
    }
    else{
      res.render('confirm')
    }
    return {
      name: reservationDto.name,
      email: reservationDto.email,
      date: reservationDto.date,
      seats: reservationDto.seats
    };
  }
}
