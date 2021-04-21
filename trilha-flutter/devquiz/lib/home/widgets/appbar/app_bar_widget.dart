import 'package:devquiz/core/app_gradients.dart';
import 'package:devquiz/core/app_text_styles.dart';
import 'package:devquiz/home/widgets/score_card/score_card_widget.dart';
import 'package:flutter/material.dart';

class AppBarWidget extends PreferredSize {
  AppBarWidget() : super(
    preferredSize: Size.fromHeight(200), 
    child: Container(
      height: 250,
      child: Stack(
       // mainAxisAlignment: MainAxisAlignment.end,
        children: [
          Container(
            height: 161,
            padding: const EdgeInsets.symmetric(horizontal: 20),
            width: double.maxFinite,
            decoration: BoxDecoration(
              gradient: AppGradients.linear
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text.rich(
                  TextSpan(
                    text: "Olá, ",
                    style: AppTextStyles.title,
                    children: [
                      TextSpan(text: "Jonathan", style: AppTextStyles.titleBold),
                      TextSpan(text: "!", style: AppTextStyles.title),
                    ]
                  )
                ),
                Container(
                  width: 58,
                  height: 58,
                  decoration: BoxDecoration(
                    image: DecorationImage(
                      image: NetworkImage(
                        "https://avatars.githubusercontent.com/u/5177402?v=4"
                      )
                    ),
                    borderRadius: BorderRadius.circular(10)
                  ),
                )
              ],
            ),
          ),
          Align(alignment: Alignment(0.0, 1.0), child: ScoreCardWidget())
        ],
      ),
    )
  );
  
}