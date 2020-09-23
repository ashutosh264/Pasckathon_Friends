#include <LiquidCrystal.h>

LiquidCrystal lcd(12, 11, 5, 4, 3, 2);
int a = 0;
int b = 0;
int Largura = 16;  
int Altura = 2; 
int stringStart, stringStop = 0;  
int sCursor = Largura;  
int tamanho = 0; 

String line1 = "Power Usage is: 20 Units";
void setup() {
  // set up the LCD's number of columns and rows:
  lcd.begin(16, 2);
  // Print a message to the LCD.
  lcd.print("Pasckathon Friends");
  
  lcd.setCursor(0,1); 
  lcd.begin(Largura,Altura);
}

void loop() {
  scroll(); //Exec scroll  
  
  lcd.setCursor(sCursor, 0);  
  lcd.print(line1.substring(stringStart,stringStop));  
  lcd.setCursor(0, 1);    
  
  //Tam String da string  
  tamanho = line1.length();  
  if (stringStart == tamanho)  
  {  
    stringStart = 0;  
    stringStop = 0;
  } 
  //lcd.setCursor(0,1);
  //lcd.print("00:00");
  
  if(b<10){
  lcd.setCursor(3, 1);
  //lcd.print("0");
    
  lcd.setCursor(4, 1);
  //lcd.print(b);
 
  }
  else if(b<60){
  lcd.setCursor(3,1);  
  //lcd.print(b);
  }
  else if(b=60){
  lcd.setCursor(1,1);
  b=0;
  a++;
  //lcd.print(a);
  }
  else if(a>10){
    lcd.setCursor(1,1);
    //lcd.print(a);
  } 
  else{
    lcd.setCursor(0,1);
    //lcd.print(a);
  }
  b++;
  delay(1000);
}

void scroll()  
{  
  lcd.clear();  
  if(stringStart == 0 && sCursor > 0)
  {  
    sCursor--;  
    stringStop++;  
  } else if (stringStart == stringStop){  
    stringStart = stringStop = 0;  
    sCursor = Largura;  
  } else if (stringStop == line1.length() && sCursor == 0) {  
    stringStart++;  
  } else {  
    stringStart++;  
    stringStop++;  
  }  
}
