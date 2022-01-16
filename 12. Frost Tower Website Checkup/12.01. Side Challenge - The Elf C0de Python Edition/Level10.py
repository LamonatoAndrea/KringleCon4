import elf, munchkins, levers, lollipops, yeeters, pits
import time
muns = munchkins.get()
lols = lollipops.get()[::-1]
for index, mun in enumerate(muns):
    while abs(mun.position["x"] - elf.position["x"]) < 6:
        time.sleep(0.05)
    elf.moveTo(lols[index].position)
elf.moveLeft(6)
elf.moveUp(100)